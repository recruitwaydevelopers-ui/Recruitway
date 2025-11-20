const Consent = require("../models/Consent-model");

// Save or update consent
const sendCookies = async (req, res) => {
    try {
        const { userId, anonId, consent, savedAt } = req.body;

        if (!userId && !anonId) {
            return res.status(400).json({ error: "Either userId or anonId required" });
        }

        const query = userId ? { userId } : { anonId };
        const update = { userId: userId || null, anonId: anonId || null, consent, savedAt: new Date(savedAt) };
        const options = { upsert: true, new: true };

        const record = await Consent.findOneAndUpdate(query, update, options);
        res.json(record);
    } catch (err) {
        console.error("Consent save error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get consent by userId
const getCookies = async (req, res) => {
    try {
        const record = await Consent.findOne({ userId: req.params.userId });
        if (!record) return res.json(null);
        res.json(record);
    } catch (err) {
        console.error("Get consent error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Migrate anon consent to logged-in user
const migrateCookies = async (req, res) => {
    try {
        const { anonId, userId } = req.body;
        if (!anonId || !userId) return res.status(400).json({ error: "Missing anonId or userId" });

        const anonRecord = await Consent.findOne({ anonId });
        if (!anonRecord) return res.json({ migrated: false });

        const record = await Consent.findOneAndUpdate(
            { userId },
            { userId, consent: anonRecord.consent, savedAt: new Date() },
            { upsert: true, new: true }
        );

        // delete old anon record
        await Consent.deleteOne({ anonId });

        res.json({ migrated: true, record });
    } catch (err) {
        console.error("Migration error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { sendCookies, getCookies, migrateCookies };
