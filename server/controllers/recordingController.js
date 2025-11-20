const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_ACCESS_KEY_SECRET = process.env.AWS_ACCESS_KEY_SECRET;


const axios = require('axios');
const crypto = require('crypto');
const Recording = require('../models/Recording');

const ZEGOCLOUD_API_BASE = process.env.ZEGOCLOUD_API_BASE || 'https://cloudrecord-api-bom.zego.im';
const ZEGOCLOUD_APP_ID = process.env.ZEGOCLOUD_APP_ID;
const ZEGOCLOUD_SERVER_SECRET = process.env.ZEGOCLOUD_SERVER_SECRET;

if (!ZEGOCLOUD_APP_ID || !ZEGOCLOUD_SERVER_SECRET) {
    console.warn('ZEGOCLOUD_APP_ID or ZEGOCLOUD_SERVER_SECRET not set in env.');
}

function generateSig(appId, nonce, secret, ts) {
    const raw = String(appId) + nonce + secret + String(ts);
    return crypto.createHash('md5').update(raw, 'utf8').digest('hex');
}

function zegoUrl(action) {
    const nonce = Date.now().toString();
    const ts = Math.floor(Date.now() / 1000);
    const sig = generateSig(ZEGOCLOUD_APP_ID, nonce, ZEGOCLOUD_SERVER_SECRET, ts);
    const url = `${ZEGOCLOUD_API_BASE}/?Action=${action}&AppId=${ZEGOCLOUD_APP_ID}&SignatureNonce=${nonce}&Timestamp=${ts}&Signature=${encodeURIComponent(sig)}&SignatureVersion=2.0&IsTest=false`;
    return url;
}

// Start recording (calls Zego StartRecord)
const startRecording = async (req, res) => {
    try {
        const { roomId, details } = req.body;
        if (!roomId) return res.status(400).json({ message: 'Room ID required' });

        // Prevent duplicates: return existing active task if exists
        const active = await Recording.findOne({ roomId, status: { $in: ['started', 'processing'] } });
        if (active) {
            return res.status(200).json({ success: true, message: 'Recording already running', taskId: active.taskId });
        }

        const url = zegoUrl('StartRecord');

        const body = {
            RoomId: roomId,
            RecordInputParams: { RecordMode: 1, StreamType: 3, MaxIdleTime: 60 },
            RecordOutputParams: { OutputFileFormat: 'mp4', OutputFolder: 'record/' },
            StorageParams: {
                Vendor: 1,
                Region: AWS_REGION,
                Bucket: AWS_BUCKET_NAME,
                AccessKeyId: AWS_ACCESS_KEY_ID,
                AccessKeySecret: AWS_ACCESS_KEY_SECRET
            }
        };

        const { data } = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
        const taskId = data?.Data?.TaskId;
        if (!taskId) {
            console.error('StartRecord missing TaskId', data);
            return res.status(500).json({ message: 'Invalid response from Zego' });
        }

        await Recording.create({
            roomId,
            taskId,
            status: 'started',
            interviewerId: details?.interviewDetails?.interviewerId || null,
            candidateId: details?.interviewDetails?.candidateId || null,
            candidateEmail: details?.interviewDetails?.candidateEmail || null,
            source: details?.source || null,
            jobTitle: details?.interviewDetails?.jobTitle || null,
            cvId: details?.interviewDetails?.cvId || null,
            companyId: details?.interviewDetails?.companyId || null,
            files: []
        });

        // start a background monitor in case recording completes quickly
        backgroundMonitor(taskId, roomId, req.app).catch((e) => console.error('monitor error', e));

        res.json({ success: true, message: 'Recording started', taskId });
    } catch (err) {
        console.error('startRecording error:', err?.response?.data || err.message);
        res.status(500).json({ message: 'Failed to start recording' });
    }
}

// Stop recording (returns immediately; server finishes processing in background)
const stopRecording = async (req, res) => {
    const { taskId, roomId } = req.body;
    if (!taskId || !roomId) return res.status(400).json({ message: 'taskId and roomId required' });

    try {
        // Set DB to processing asap so client shows 'processing' and we avoid duplicate stop attempts
        await Recording.findOneAndUpdate({ taskId }, { status: 'processing', endTime: new Date() }, { new: true });

        // Tell Zego to stop; don't wait for all files to be finished
        try {
            const stopUrl = zegoUrl('StopRecord');
            await axios.post(stopUrl, { TaskId: taskId }, { headers: { 'Content-Type': 'application/json' } });
        } catch (e) {
            // even if StopRecord call fails, keep monitoring to attempt to pick up files when ready
            console.error('StopRecord call error (continuing monitoring):', e?.response?.data || e.message);
        }

        // Fire background monitor that polls DescribeRecordStatus and updates DB when finished.
        backgroundMonitor(taskId, roomId, req.app).catch((e) => console.error('monitor error', e));

        // return instantly
        return res.json({ message: 'Recording stopping; processing continues in background', taskId });
    } catch (err) {
        console.error('stopRecording controller error:', err?.response?.data || err.message);
        await Recording.findOneAndUpdate({ taskId }, { status: 'failed' });
        return res.status(500).json({ message: 'Failed to stop recording' });
    }
}

// Poll the Zego Describe status for this taskId until files appear and are finished
const activeTimers = new Map(); // in-memory guard so we don't create duplicate monitors in same process

async function describeRecordStatus(taskId, roomId) {
    const url = zegoUrl('DescribeRecordStatus');
    const body = { TaskId: taskId, RoomId: roomId };
    const { data } = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
    return data;
}

async function backgroundMonitor(taskId, roomId, app) {
    // Already monitoring in this process?
    if (activeTimers.has(taskId)) return;
    let attempts = 0;
    const maxAttempts = parseInt(process.env.MONITOR_MAX_ATTEMPTS || '120', 10); // default ~10 minutes at 5s
    const intervalMs = parseInt(process.env.MONITOR_POLL_INTERVAL_MS || '5000', 10);

    const timer = setInterval(async () => {
        attempts++;
        try {
            const result = await describeRecordStatus(taskId, roomId);
            const zData = result?.Data;
            const files = (zData?.RecordFiles) || [];

            if (files.length > 0) {
                const mapped = files.map((f) => ({
                    FileUrl: f.FileUrl || f.FileKey,
                    Status: f.Status,
                    FileSize: f.FileSize,
                    Duration: f.Duration
                }));

                const allFinished = mapped.every((f) => f.Status === 4 && f.FileUrl);
                if (allFinished) {
                    const recordingUrl = mapped[0].FileUrl || null;

                    await Recording.findOneAndUpdate({ taskId }, {
                        status: 'completed',
                        files: mapped,
                        recordingUrl,
                        endTime: new Date()
                    }, { new: true });

                    // Emit socket event so clients update instantly
                    const io = app.get('io');
                    if (io) {
                        io.emit('recording:completed', { taskId, roomId, recordingUrl, files: mapped });
                    }

                    clearInterval(timer);
                    activeTimers.delete(taskId);
                } else {
                    // partial: mark processing & continue
                    await Recording.findOneAndUpdate({ taskId }, { status: 'processing', files: mapped }, { new: true });
                }
            } else {
                console.log("Not Uploaded");

                // no files yet: keep waiting
            }
        } catch (e) {
            console.error('backgroundMonitor describe error:', e?.response?.data || e.message);
            // don't fail the monitor; continue until max attempts
        }

        if (attempts >= maxAttempts) {
            clearInterval(timer);
            activeTimers.delete(taskId);
            // mark failed if still not completed
            await Recording.findOneAndUpdate({ taskId }, { status: 'failed', endTime: new Date() }, { new: true });
            const io = app.get('io'); if (io) io.emit('recording:failed', { taskId, roomId });
        }
    }, intervalMs);

    activeTimers.set(taskId, timer);
    // run immediately once
    (async () => {
        try {
            const result = await describeRecordStatus(taskId, roomId);
            // small duplication with main loop but helpful for quick finishes
            const files = (result?.Data?.RecordFiles) || [];
            if (files.length > 0) {
                const mapped = files.map((f) => ({
                    FileUrl: f.FileUrl || f.FileKey,
                    Status: f.Status,
                    FileSize: f.FileSize,
                    Duration: f.Duration
                }));
                const allFinished = mapped.every((f) => f.Status === 4 && f.FileUrl);
                if (allFinished) {
                    await Recording.findOneAndUpdate({ taskId }, {
                        status: 'completed',
                        files: mapped,
                        recordingUrl: mapped[0].FileUrl || null,
                        endTime: new Date()
                    }, { new: true });
                    const io = app.get('io'); if (io) io.emit('recording:completed', { taskId, roomId, recordingUrl: mapped[0].FileUrl, files: mapped });
                    clearInterval(timer);
                    activeTimers.delete(taskId);
                } else {
                    await Recording.findOneAndUpdate({ taskId }, { status: 'processing', files: mapped }, { new: true });
                }
            }
        } catch (e) {
            // ignore
        }
    })();
}

// GET status (client polling fallback)
const getRecordingStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { roomId } = req.query;
        if (!taskId || !roomId) return res.status(400).json({ error: 'taskId and roomId required' });

        const result = await describeRecordStatus(taskId, roomId);
        const files = (result?.Data?.RecordFiles) || [];

        if (files.length) {
            const mapped = files.map((f) => ({ FileUrl: f.FileUrl || f.FileKey, Status: f.Status, FileSize: f.FileSize, Duration: f.Duration }));
            const allFinished = mapped.every((f) => f.Status === 4 && f.FileUrl);
            const status = allFinished ? 'completed' : 'processing';
            return res.json({ status, details: { files: mapped, recordingUrl: mapped[0]?.FileUrl || null } });
        }
        return res.json({ status: 'processing', details: { files: [], recordingUrl: null } });
    } catch (err) {
        console.error('getRecordingStatus error:', err?.response?.data || err.message);
        res.status(500).json({ error: err.message });
    }
}

// Admin: list recordings (debug)
const getAllRecordings = async (req, res) => {
    const list = await Recording.find().sort({ createdAt: -1 }).limit(200).lean();
    res.status(200).json({ success: true, data: list });
}


module.exports = {
    startRecording,
    stopRecording,
    getRecordingStatus,
    getAllRecordings
}
