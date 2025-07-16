import axios from 'axios';

const BASE_URL='http://localhost:5238/api/Room';

export const getAllRooms = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getRoomById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await axios.post(BASE_URL, roomData);
  return response.data;
};

export const updateRoom = async (id, roomData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, roomData);
  return response.data;
};

export const deleteRoom = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const getAvailableRoomsByDateRange = async (checkIn, checkOut) => {
  const response = await axios.get(`${BASE_URL}/available`, {
    params: {
      checkIn: checkIn,
      checkOut: checkOut
    }
  });
  return response.data;
};
