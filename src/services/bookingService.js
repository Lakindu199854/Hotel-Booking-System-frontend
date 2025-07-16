// const BASE_URL = "http://localhost:5000/api/Booking";

// export const getAllBookings = async () => {
//   const response = await fetch(BASE_URL);
//   return await response.json();
// };

// export const addBooking = async (booking) => {
//   const response = await fetch(BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(booking),
//   });
//   return await response.json();
// };

// export const deleteBooking = async (id) => {
//   await fetch(`${BASE_URL}/${id}`, {
//     method: "DELETE",
//   });
// };



// src/services/bookingService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5238/api/Booking';

export async function getAllBookings() {
  const response = await axios.get(API_BASE);
  return response.data;
}

export async function getBookingById(id) {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
}


export async function createBooking(bookingData) {
  const response = await axios.post(API_BASE, bookingData);
  return response.data;
}

export async function deleteBooking(id) {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
}
