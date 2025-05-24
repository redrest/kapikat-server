require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/errorMiddleware');
const productRoutes = require('./router/productRoutes');
const categoryRoutes = require('./router/categoryRoutes');
const cartRoutes = require('./router/cartRoutes');
const orderRoutes = require('./router/orderRoutes');
const userRoutes = require('./router/userRoutes');
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors( {
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use('/auth', router);
app.use('/products', productRoutes);
app.use('/category', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/profile', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(5000, () => console.log(`Server started on PORT: ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}
start();
