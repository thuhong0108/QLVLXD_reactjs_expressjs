import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Order'
    },
    productId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Product'
    },
    quantity: { 
        type: Number,
        min: 0,
        required: true
    },
    price: { 
        type: Number,
        min: 0,
        required: true 
    },
});

const OrderDetails = mongoose.model('OrderDetails', orderDetailsSchema);

export default OrderDetails;
