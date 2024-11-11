import axios from 'axios';
import { API_BASE_URL } from '../config';

export const fetchSales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};

export const addSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addSale`, saleData);
    return response.data;
  } catch (error) {
    console.error("Error adding sale:", error);
    throw error;
  }
};
