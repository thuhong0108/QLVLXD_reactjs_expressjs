import Customer from "../models/Customer.js";

async function saveCustomer(data) {
    try {
        const newCustomer = new Customer(data);
        const savedProduct = await newCustomer.save();
        return savedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
}

export { saveCustomer };