import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Divider
} from '@mui/material';
import { getResponse } from '../services/chatbotService';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I assist you today?Please Choose from options below' }
  ]);
  const [awaitingDate, setAwaitingDate] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const handleOptionClick = (option) => {
    if (option === 'predict_availability') {
      addMessage('user', 'Predict availability');
      addMessage('bot', 'Please enter a date (YYYY-MM-DD):');
      setAwaitingDate('predict');
    } else if (option === 'check_available_rooms') {
      addMessage('user', 'Check available rooms');
      addMessage('bot', 'Please enter a date (YYYY-MM-DD):');
      setAwaitingDate('availableRooms');
    } else {
      sendToApi(option);
    }
  };

  const sendToApi = async (messageText) => {
    try {
      addMessage('user', messageText);
      const response = await getResponse(messageText);
      addMessage('bot', response.response);
    } catch (err) {
      addMessage('bot', 'Error contacting the server.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (awaitingDate === 'predict') {
      sendToApi(`predict availability for ${input}`);
    } else if (awaitingDate === 'availableRooms') {
      sendToApi(`check available rooms for ${input}`);
    } else {
      sendToApi(input);
    }

    setInput('');
    setAwaitingDate(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: 'auto',
        mt: 6,
        p: 2,
        boxShadow: 3,
        borderRadius: 3
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Hotel Assistant
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            height: 350,
            overflowY: 'auto',
            p: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            mb: 2,
            backgroundColor: '#fafafa'
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                textAlign: msg.sender === 'bot' ? 'left' : 'right',
                mb: 1,
                px: 1
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  display: 'inline-block',
                  bgcolor: msg.sender === 'bot' ? '#e0f7fa' : '#c8e6c9',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: '80%'
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))}
          <Box ref={messagesEndRef} />
        </Box>

        {!awaitingDate && (
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2} justifyContent="center">
            <Button variant="outlined" onClick={() => handleOptionClick('predict_availability')}>
              Predict Availability
            </Button>
            <Button variant="outlined" onClick={() => handleOptionClick('What is the check-in time?')}>
              Check-in Time
            </Button>
            {/* <Button variant="outlined" onClick={() => handleOptionClick('I want to cancel my booking')}>
              Cancel Booking
            </Button> */}
            <Button variant="outlined" onClick={() => handleOptionClick('check_available_rooms')}>
              Available Rooms
            </Button>
          </Stack>
        )}

        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label={awaitingDate ? 'Enter date (YYYY-MM-DD)' : 'Type your message'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" variant="contained">
              Send
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
