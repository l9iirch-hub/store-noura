const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require('./routes/chatRoutes');
const path = require('path');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allows React app to connect
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Configure Socket globally so controllers can emit events via req.app.get('io')
app.set('io', io);

// Handle live connections
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join an isolation room (e.g for User ID or Admin group)
    socket.on('join', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    // Handle incoming chat messages directly + DB Persistence
    socket.on('sendMessage', async (data) => {
        try {
            const ChatSession = require('./models/ChatSession');
            let session = await ChatSession.findOne({ guestId: data.guestId });

            if (!session) {
                session = new ChatSession({
                    guestId: data.guestId,
                    guestName: data.guestName || 'Visiteur'
                });
            }

            const newMessage = { sender: data.sender, text: data.text, timestamp: new Date() };
            session.messages.push(newMessage);

            if (data.sender === 'Client') {
                session.unreadByAdmin += 1;
            } else {
                session.unreadByClient += 1;
            }

            await session.save();

            // Broadcast the new message and full session update globally to room channels
            io.emit('receiveMessage', { sessionId: session.guestId, message: newMessage });
            io.emit('sessionUpdated', session);

        } catch (error) {
            console.error('Socket message error', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Main Route
app.get('/', (req, res) => {
    res.send('Noura Couture API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server (with WebSockets) running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
