const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sender: { type: String, enum: ['Admin', 'Client'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
    guestId: { type: String, required: true, unique: true }, // Identifier from local storage to persist session
    guestName: { type: String, default: 'Visiteur' },
    messages: [chatMessageSchema],
    isActive: { type: Boolean, default: true },
    unreadByAdmin: { type: Number, default: 0 },
    unreadByClient: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
