const express = require('express');
const authRoutes = require("./routerDir/authRoutes");
const productRoutes = require("./routerDir/productRoutes");
const categoryRoutes = require("./routerDir/categoryRoutes");
const cartRoutes = require("./routerDir/cartRoutes");
const orderRoutes = require("./routerDir/orderRoutes");
const userRoutes = require("./routerDir/userRoutes");
const router = express.Router();


router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/category', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);
router.use('/profile', userRoutes);

module.exports = router;
