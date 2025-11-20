const Contact = require("../models/Contact-model");
const { sendInterviewEmail } = require("../utils/interview-emailService");

// Handle new contact message
const sendContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields (name, email, message) are required" });
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Message length check
        if (message.length < 5) {
            return res.status(400).json({ error: "Message should be at least 5 characters long" });
        }

        // Save to DB
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        return res.status(201).json({ message: "Message saved successfully" });
    } catch (err) {
        // console.error("Error in sendContact:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all contacts
const getContact = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        if (!contacts || contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }

        return res.status(200).json({ success: true, data: contacts });
    } catch (err) {
        // console.error("Error in getContact:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Send Reply to contact
const reply = async (req, res) => {

    const { contactId, newMessage } = req.body;

    if (!contactId || !newMessage) {
        return res.status(400).json({ message: "contactId and message are required" });
    }

    try {
        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await sendInterviewEmail({
            to: contact.email,
            subject: 'Response to Your Message',
            template: 'messageReply',
            context: {
                userName: contact.name,
                oldMessage: contact.message,
                newMessage: newMessage
            }
        });

        contact.status = "replied"
        await contact.save()

        return res.status(200).json({ success: true, message: "Response sent successfully" });
    } catch (err) {
        // console.error("Error in send reply:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    const { id } = req.params;

    try {
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (err) {
        // console.error("Error in deleteContact:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { sendContact, getContact, reply, deleteContact };
