// defining the base URL of the backend and configuring API calls

import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api";

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register/`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data);
        throw error;
    }
};

export const verifyAccount = async (email, code) => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify/`, { email, code });
        return response.data;
    } catch (error) {
        console.error("Verification Error:", error.response?.data);
        throw error;
    }
};
