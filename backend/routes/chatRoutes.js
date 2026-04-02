const express = require('express');
const router = express.Router();
const { getSessions, getSessionById, markAsRead } = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getSessions);
router.route('/:guestId').get(getSessionById);
router.route('/:guestId/read').put(markAsRead);

module.exports = router;
