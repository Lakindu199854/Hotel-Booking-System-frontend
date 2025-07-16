import axios from 'axios';

const API_BASE = 'http://localhost:5238/api/Chat';

export async function getResponse(chatMessage) {
  const response = await axios.post(API_BASE, {
    message: chatMessage
  });

  return response.data;
}
