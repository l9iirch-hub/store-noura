const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to DB. Creating Admin...');

    const adminExists = await User.findOne({ email: 'admin@noura.com' });
    if (!adminExists) {
        await User.create({
            name: 'Noura Admin',
            email: 'admin@noura.com',
            password: 'adminpassword',
            isAdmin: true
        });
        console.log('Admin user created successfully!');
        console.log('Email: admin@noura.com');
        console.log('Password: adminpassword');
    } else {
        console.log('Admin already exists (admin@noura.com).');
    }
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
