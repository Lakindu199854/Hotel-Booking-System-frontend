import axios from 'axios';

const BASE_URL='http://localhost:5238/api/SpecialReq';

export const getAllSpecialRequest = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createSpecialRequest = async (specialRequest) => {
  const response = await axios.post(BASE_URL, specialRequest);
  return response.data;
};

export const updateSpecialRequest = async (id, specialRequest) => {
  const response = await axios.put(`${BASE_URL}/${id}`, specialRequest);
  return response.data;
};

export const deleteSpecialRequest = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
