import axios from 'axios';

const BASE_URL='http://localhost:5238/api/Customer';

export const getAllCustomers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCustomer = async (customerData) => {
  const response = await axios.post(BASE_URL, customerData);
  return response.data;
};

