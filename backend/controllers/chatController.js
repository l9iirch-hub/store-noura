const ChatSession = require('../models/ChatSession');

// @desc    Get all chat sessions
// @route   GET /api/chat
// @access  Private/Admin
const getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({}).sort('-updatedAt');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single chat session by guestId
// @route   GET /api/chat/:guestId
// @access  Public
const getSessionById = async (req, res) => {
    try {
        let session = await ChatSession.findOne({ guestId: req.params.guestId });
        if (session) {
            res.json(session);
        } else {
            // Return empty instead of 404 so client can start clean
            res.json({ guestId: req.params.guestId, messages: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark session as read
// @route   PUT /api/chat/:guestId/read
// @access  Public (client) / Private (admin)
const markAsRead = async (req, res) => {
    try {
        const session = await ChatSession.findOne({ guestId: req.params.guestId });
        if (session) {
            // We use a simple payload flag or check auth for admin
            const { isAdmin } = req.body;
            if (isAdmin) {
                session.unreadByAdmin = 0;
            } else {
                session.unreadByClient = 0;
            }
            await session.save();
            res.json(session);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { getSessions, getSessionById, markAsRead };
