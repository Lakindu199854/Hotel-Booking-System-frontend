import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup
} from '@mui/material';
import { createCustomer, getAllCustomers } from '../services/customerService';
import { getAllRooms } from '../services/roomService';
import { createBooking } from '../services/bookingService';
import { getAllSpecialRequest } from '../services/specialRequest';

export default function AddBooking() {
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customerType, setCustomerType] = useState('existing');
  const [specialRequests, setSpecialRequest] = useState([]);


  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [booking, setBooking] = useState({
    customerId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    isRecurring: false,
    recurrenceType: 'weekly',
    specialRequests: []
  });


  useEffect(() => {
    getAllCustomers().then(data => setCustomers(data));
    getAllRooms().then(data => setRooms(data));
    getAllSpecialRequest().then(data => setSpecialRequest(data));

  }, []);

  const handleBookingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setBooking(prev => ({ ...prev, [name]: newValue }));
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecialRequestToggle = (request) => {
    setBooking(prev => {
      const exists = prev.specialRequests.some(r => r.requestId === request.requestId);
      const updatedRequests = exists
        ? prev.specialRequests.filter(r => r.requestId !== request.requestId)
        : [...prev.specialRequests, request];

      return { ...prev, specialRequests: updatedRequests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let customerId = booking.customerId;

      if (customerType === 'new') {
        const res = await createCustomer(newCustomer);
        customerId = res.customerId;
      }

      if (!customerId || !booking.roomId || !booking.checkInDate || !booking.checkOutDate) {
        alert('Please fill all required fields.');
        return;
      }

      const finalBooking = {
        ...booking,
        customerId: Number(customerId),
        roomId: Number(booking.roomId),
      };

      await createBooking(finalBooking);

      alert('Booking added!');
      // Reset form
      setBooking({
        customerId: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: '',
        isRecurring: false,
        specialRequests: []
      });
      setNewCustomer({ name: '', email: '', phone: '' });
      setCustomerType('existing');
      getAllCustomers().then(data => setCustomers(data));
    } catch (err) {
      console.error(err);
      alert('Failed to add booking');
    }
  };


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add Booking
      </Typography>

      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            row
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <FormControlLabel value="existing" control={<Radio />} label="Existing Customer" />
            <FormControlLabel value="new" control={<Radio />} label="New Customer" />
          </RadioGroup>
        </FormControl>

        {customerType === 'existing' ? (
          <FormControl fullWidth margin="normal">
            <InputLabel>Customer</InputLabel>
            <Select
              name="customerId"
              value={booking.customerId}
              label="Customer"
              onChange={handleBookingChange}
            >
              {customers.map(c => (
                <MenuItem key={c.customerId} value={c.customerId}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Customer Name"
              value={newCustomer.name}
              onChange={handleNewCustomerChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              value={newCustomer.email}
              onChange={handleNewCustomerChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="phone"
              label="Phone"
              value={newCustomer.phone}
              onChange={handleNewCustomerChange}
            />
          </>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Room</InputLabel>
          <Select
            name="roomId"
            value={booking.roomId}
            label="Room"
            onChange={handleBookingChange}
          >
            {rooms.map(r => (
              <MenuItem key={r.roomId} value={r.roomId}>
                Room {r.roomId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          name="checkInDate"
          label="Check-In Date"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={booking.checkInDate}
          onChange={handleBookingChange}
        />

        <TextField
          fullWidth
          margin="normal"
          name="checkOutDate"
          label="Check-Out Date"
          type="datetime-local"
          InputLabelProps={{ shrink: true }}
          value={booking.checkOutDate}
          onChange={handleBookingChange}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={booking.isRecurring}
              onChange={handleBookingChange}
              name="isRecurring"
            />
          }
          label="Recurring Booking"
        />
        {booking.isRecurring && (
          <>
            <TextField
              fullWidth
              margin="normal"
              name="recurrenceCount"
              label="Number of Recurrences"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              value={booking.recurrenceCount}
              onChange={handleBookingChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Recurrence Type</InputLabel>
              <Select
                name="recurrenceType"
                value={booking.recurrenceType}
                label="Recurrence Type"
                onChange={handleBookingChange}
              >
                {/* <MenuItem value="daily">Daily</MenuItem> */}
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </>
        )}


        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Special Requests
        </Typography>
        <FormGroup>
          {specialRequests.map((req) => (
            <FormControlLabel
              key={req.requestId}
              control={
                <Checkbox
                  checked={booking.specialRequests.some(r => r.requestId === req.requestId)}
                  onChange={() => handleSpecialRequestToggle(req)}
                />
              }
              label={req.description}
            />
          ))}
        </FormGroup>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 3 }}
        >
          Submit Booking
        </Button>
      </form>
    </Box>
  );
}
