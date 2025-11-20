const {
    CreateMultipartUploadCommand,
    UploadPartCommand,
    CompleteMultipartUploadCommand,
    AbortMultipartUploadCommand,
    GetObjectCommand,
    HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, BUCKET_NAME } = require("../utils/s3Helper");
const VideoRecording = require("../models/VideoRecording");

// Track active uploads in memory
const uploadBuffers = {};

const startUpload = async (req, res) => {
    try {
        const { fileName } = req.body;
        const key = `recordings/${fileName}`;

        const command = new CreateMultipartUploadCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: "video/webm",
        });

        const response = await s3.send(command);

        uploadBuffers[response.UploadId] = { buffer: [], size: 0, partNumber: 1, parts: [] };

        res.json({ uploadId: response.UploadId, key: response.Key, message: "Recording Started" });
    } catch (err) {
        console.error("Error in startUpload:", err);
        res.status(500).json({ error: err.message });
    }
};

const uploadPart = async (req, res) => {
    try {
        const { uploadId, key } = req.body;
        const file = req.file;

        if (!uploadId || !key) return res.status(400).json({ error: "Missing uploadId or key" });

        const tracker = uploadBuffers[uploadId];
        if (!tracker) return res.status(400).json({ error: "UploadId not tracked" });

        tracker.buffer.push(file.buffer);
        tracker.size += file.size;

        // Flush if ≥ 5 MB
        if (tracker.size >= 5 * 1024 * 1024) {
            const combined = Buffer.concat(tracker.buffer);
            const partNum = tracker.partNumber;

            const command = new UploadPartCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNum,
                Body: combined,
            });

            const response = await s3.send(command);

            tracker.parts.push({ ETag: response.ETag, PartNumber: partNum });
            tracker.partNumber++;
            tracker.buffer = [];
            tracker.size = 0;

            console.log(`✅ Flushed part ${partNum} (${combined.length} bytes)`);

            res.json({ flushed: true, ETag: response.ETag, PartNumber: partNum });
        } else {
            res.json({ buffered: true, currentSize: tracker.size });
        }
    } catch (err) {
        console.error("Error in uploadPart:", err);
        res.status(500).json({ error: err.message });
    }
};

const completeUpload = async (req, res) => {
    try {
        const { uploadId, key, interviewId } = req.body;
        const tracker = uploadBuffers[uploadId];

        if (!tracker) return res.status(400).json({ error: "UploadId not tracked" });

        // Flush last chunk if it exists
        if (tracker.size > 0) {
            const combined = Buffer.concat(tracker.buffer);
            const partNum = tracker.partNumber;

            const command = new UploadPartCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                UploadId: uploadId,
                PartNumber: partNum,
                Body: combined,
            });

            const response = await s3.send(command);
            tracker.parts.push({ ETag: response.ETag, PartNumber: partNum });
            console.log(`✅ Flushed final part ${partNum} (${combined.length} bytes)`);
        }

        const completeCommand = new CompleteMultipartUploadCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
            MultipartUpload: { Parts: tracker.parts },
        });

        const response = await s3.send(completeCommand);

        delete uploadBuffers[uploadId];

        // 🔹 Save recording reference
        if (interviewId) {
            await VideoRecording.create({ interviewId, location: response.Location, key });
        }

        console.log(interviewId)

        res.json({ message: "Upload completed", key });
    } catch (err) {
        console.error("Error in completeUpload:", err);
        res.status(500).json({ error: err.message });
    }
};

// Abort upload (optional cleanup)
const abortUpload = async (req, res) => {
    try {
        const { uploadId, key } = req.body;

        const command = new AbortMultipartUploadCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            UploadId: uploadId,
        });

        await s3.send(command);

        console.log("Upload aborted:", key);

        res.json({ message: "Upload aborted" });
    } catch (err) {
        console.error("Error in abortUpload:", err);
        res.status(500).json({ error: err.message });
    }
};

const getVideoUrl = async (req, res) => {
    try {
        const { encodedKey } = req.query;
        const key = decodeURIComponent(encodedKey);

        if (!key || typeof key !== "string") {
            return res.status(400).json({ success: false, error: "Invalid or missing key parameter" });
        }

        let signedUrl, metadata;
        try {
            // Generate signed URL
            signedUrl = await getSignedUrl(
                s3,
                new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
                { expiresIn: 3600 }
            );

            try {
                const headData = await s3.send(new HeadObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: key
                }));

                metadata = {
                    contentType: headData.ContentType,
                    contentLength: headData.ContentLength,
                    lastModified: headData.LastModified,
                    eTag: headData.ETag,
                };
            } catch (s3Error) {
                console.error("S3 HeadObject Error:", s3Error);
                return res.status(500).json({ success: false, error: "Could not fetch video metadata" });
            }

        } catch (s3Error) {
            console.error("S3 Error:", s3Error);
            return res.status(500).json({ success: false, error: "Could not fetch video details" });
        }

        return res.json({
            success: true,
            url: signedUrl,
            info: metadata
        });
    } catch (error) {
        console.error("Unexpected Error in getVideoUrl:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

module.exports = { startUpload, uploadPart, completeUpload, getVideoUrl, abortUpload }