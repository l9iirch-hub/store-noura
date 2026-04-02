const Order = require('../models/Order');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, orderItems, totalPrice, notes } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                customerName,
                customerEmail,
                customerPhone,
                orderItems,
                totalPrice,
                notes
            });

            const createdOrder = await order.save();

            // Emit Socket Real-Time Event globally
            if (req.app.get('io')) {
                req.app.get('io').emit('newOrder', createdOrder);
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            if (req.app.get('io')) {
                req.app.get('io').emit('orderStatusUpdated', updatedOrder);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, createOrder, updateOrderStatus };
