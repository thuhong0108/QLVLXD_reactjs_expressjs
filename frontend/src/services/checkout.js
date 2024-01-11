import axios from 'axios';

const BASE_URL = 'https://vnprovinces.pythonanywhere.com/api';

export const getAllProvinces = async() => {
    try {
        const response = await axios.get(`${BASE_URL}/provinces/?basic=true&limit=100`);
        return response.data.results;
    } catch (error) {
        return error.response.data;
    }
}

export const getDistricts = async(id) => {
    try {
        const response = await axios.get(`${BASE_URL}/provinces/${id}`);
        return response.data.districts;
    } catch (error) {
        return error.response.data;
    }
}

export const getWards = async(id) => {
    try {
        const response = await axios.get(`${BASE_URL}/districts/${id}`);
        return response.data.wards;
    } catch (error) {
        return error.response.data;
    }
}