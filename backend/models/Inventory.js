import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        min: 0,
        required: true
    },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
