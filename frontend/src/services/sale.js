import axios from 'axios';

const BASE_URL = 'http://localhost:7000/api/sale';

export const order = async(data) => {
    try {
        const response = await axios.post(`${BASE_URL}/order`, data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}

export const getAllOrders = async() => {
    try {
        const response = await axios.get(`${BASE_URL}/viewOrders`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}