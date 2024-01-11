import express from "express";
import Order from "../models/Order.js";
import { saveCustomer } from '../services/Order.js';
import OrderDetails from "../models/OrderDetails.js";

const router = express.Router();

// Xem tất cả các đơn hàng
router.get('/viewOrders', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', ['name']);
        res.status(200).json({ 
            message: 'Lấy tất cả đơn hàng thành công', 
            data: orders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Đặt hàng
router.post('/order', async (req, res) => {
    try {
        const customer = req.body[0]; // Thông tin khách hàng
        const products = req.body[1]; // Danh sách các sản phẩm được đặt hàng

        let orderItems = [];
        let totalPrice = 0;

        for (const product of products) {
            totalPrice += product.price * product.quantity;

            orderItems.push({
                productId: product._id,
                quantity: product.quantity,
                price: product.price,
            });
        }

        const newCustomer = await saveCustomer(customer);

        // Tạo và lưu đơn hàng vào database
        const newOrder = new Order({ customer: newCustomer._id, totalPrice });
        const savedOrder = await newOrder.save();

        orderItems = orderItems.map(item => {
            item.orderId = savedOrder._id;
            return item;
        });
        await OrderDetails.insertMany(orderItems);

        res.status(200).json({
            success: true,
            message: 'Đặt hàng thành công',
            data: savedOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;