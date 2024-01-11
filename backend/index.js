import cors from 'cors';
import express from "express";
import mongoose from "mongoose";
import authRoute from './routes/Auth.js';
import categoryRoute from './routes/Category.js';
import productRoute from './routes/Product.js';
import saleRoute from './routes/Sale.js';
import userRoute from './routes/User.js';

// Connect to MongoDB
mongoose.connect('mongodb+srv://tranhuhong0108:thuhong0108@cluster0.az6eral.mongodb.net/', () => {
    console.log('Connected to MongoDB');
});

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/product', productRoute);
app.use('/api/sale', saleRoute);

// Start server
app.listen(7000, () => {
    console.log('Server started on PORT 7000');
});

