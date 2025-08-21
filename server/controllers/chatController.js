const ChatMessage = require('../models/ChatMessage');
const CompanyProfile = require('../models/Auth/Company-model');
const { default: mongoose } = require('mongoose');

const getChatHistory = async (req, res) => {
    try {
        const { _id } = req.user;
        const { otherUserId } = req.params;

        const messages = await ChatMessage.find({
            $or: [
                { sender: _id, receiver: otherUserId },
                { sender: otherUserId, receiver: _id }
            ],
            deletedFor: { $ne: _id }
        })
            .sort({ createdAt: 1 })
            .populate('sender receiver', 'name role');

        res.status(200).json({ data: messages });

    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { userId } = req.user;
        const { messageIds } = req.body;

        await ChatMessage.updateMany(
            {
                _id: { $in: messageIds },
                receiver: userId
            },
            { $set: { status: 'read' } }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { userId } = req.user;
        const { messageId } = req.params;

        await ChatMessage.findByIdAndUpdate(
            messageId,
            { $addToSet: { deletedFor: userId } }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllChatPerson = async (req, res) => {
    try {
        const superAdminId = new mongoose.Types.ObjectId(req.user._id);

        console.log(superAdminId);


        const chatUsers = await ChatMessage.aggregate([
            {
                $match: {
                    $or: [
                        { sender: superAdminId },
                        { receiver: superAdminId }
                    ]
                }
            },
            {
                $project: {
                    otherUser: {
                        $cond: [
                            { $eq: ['$sender', superAdminId] },
                            '$receiver',
                            '$sender'
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$otherUser'
                }
            },
            {
                $lookup: {
                    from: 'companyprofiles', // collection name in MongoDB
                    localField: '_id', // _id from the previous group stage is the userId
                    foreignField: 'userId',
                    as: 'company'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $project: {
                    _id: '$company.userId',
                    fullname: '$company.fullname',
                    email: '$company.email',
                    profilePicture: '$company.profilePicture',
                    tagline: '$company.tagline',
                    contactPhone: '$company.contactPhone',
                    lastActive: '$company.lastActive'
                }
            }
        ]);

        res.status(200).json({ chatList: chatUsers });
    } catch (error) {
        console.error('Error in getAllChatPerson:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getChatHistory, markAsRead, deleteMessage, getAllChatPerson }