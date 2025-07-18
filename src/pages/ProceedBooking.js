import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getAllSpecialRequest } from '../services/specialRequest';
import { createBooking } from '../services/bookingService';
import ErrorDialog from '../components/ErrorDialog';
import { createCustomer,getAllCustomers } from '../services/customerService';

export default function ProceedBooking() {
  const location = useLocation();
  const { selectedRoom, checkIn, checkOut } = location.state;

  const [customerMode, setCustomerMode] = useState('existing');
  const [customer, setCustomer] = useState({
    customerId: 1,
    name: '',
    email: '',
    phone: ''
  });
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceCount, setRecurrenceCount] = useState('');
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [specialRequests, setSpecialRequest] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

useEffect(() => {
  getAllSpecialRequest().then(setSpecialRequest);

  getAllCustomers()
    .then((data) => setExistingCustomers(data))
    .catch((err) => console.error("Error fetching customers", err));
}, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleRequest = (request) => {
    const exists = selectedRequests.some(r => r.requestId === request.requestId);
    const updated = exists
      ? selectedRequests.filter(r => r.requestId !== request.requestId)
      : [...selectedRequests, request];
    setSelectedRequests(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let customerIdToUse;

    if (customerMode === 'existing') {
      if (!selectedCustomerId) {
        alert('Please select an existing customer.');
        return;
      }
      customerIdToUse = selectedCustomerId;
    } else {
      if (!customer.name || !customer.email || !customer.phone) {
        alert('Please fill in all new customer fields.');
        return;
      }

      try {
  const newCustomer = await createCustomer(customer);
  customerIdToUse = newCustomer.customerId;
} catch (err) {
  setErrorMessage('Failed to create new customer');
  setErrorDialogOpen(true);
  return;
}
    }

    const bookingData = {
      customerId: customerIdToUse,
      roomId: selectedRoom.roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      isRecurring,
      recurrenceCount: isRecurring ? Number(recurrenceCount) : undefined,
      recurrenceType: isRecurring ? recurrenceType : undefined,
      specialRequests: selectedRequests
    };

    try {
      await createBooking(bookingData);
      alert('Booking Successful!');
      setCustomer({ customerId: '', name: '', email: '', phone: '' });
      setSelectedCustomerId('');
      setIsRecurring(false);
      setRecurrenceCount('');
      setRecurrenceType('weekly');
      setSelectedRequests([]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed';
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>Add Booking</Typography>

      <RadioGroup row value={customerMode} onChange={(e) => setCustomerMode(e.target.value)} sx={{ mb: 2 }}>
        <FormControlLabel value="existing" control={<Radio />} label="Existing Customer" />
        <FormControlLabel value="new" control={<Radio />} label="New Customer" />
      </RadioGroup>

      {customerMode === 'existing' ? (
        <FormControl fullWidth margin="normal">
          <InputLabel>Customer</InputLabel>
          <Select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <MenuItem value="">-- Select Customer --</MenuItem>
            {existingCustomers.map((cust) => (
              <MenuItem key={cust.customerId} value={cust.customerId}>
                {cust.name} ({cust.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          {/* <TextField
            fullWidth
            margin="normal"
            label="Customer ID"
            name="customerId"
            value={customer.customerId}
            onChange={handleChange}
          /> */}
          <TextField
            fullWidth
            margin="normal"
            label="Customer Name"
            name="name"
            value={customer.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={customer.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
          />
        </>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Room</InputLabel>
        <Select value={selectedRoom.roomId} disabled>
          <MenuItem value={selectedRoom.roomId}>
            {selectedRoom.roomType} (Room {selectedRoom.roomId})
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Check-In Date"
        type="datetime-local"
        value={checkIn}
        InputLabelProps={{ shrink: true }}
        disabled
      />
      <TextField
        fullWidth
        margin="normal"
        label="Check-Out Date"
        type="datetime-local"
        value={checkOut}
        InputLabelProps={{ shrink: true }}
        disabled
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
        }
        label="Recurring Booking"
      />

      {isRecurring && (
        <>
          <TextField
            fullWidth
            margin="normal"
            label="Number of Recurrences"
            type="number"
            value={recurrenceCount}
            onChange={(e) => setRecurrenceCount(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Recurrence Type</InputLabel>
            <Select
              value={recurrenceType}
              label="Recurrence Type"
              onChange={(e) => setRecurrenceType(e.target.value)}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </>
      )}

      <Typography variant="subtitle1" sx={{ mt: 2 }}>Special Requests</Typography>
      <FormGroup>
        {specialRequests.map((req) => (
          <FormControlLabel
            key={req.requestId}
            control={
              <Checkbox
                checked={selectedRequests.some(r => r.requestId === req.requestId)}
                onChange={() => handleToggleRequest(req)}
              />
            }
            label={req.description}
          />
        ))}
      </FormGroup>

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Submit Booking
      </Button>

      <ErrorDialog
        open={errorDialogOpen}
        message={errorMessage}
        onClose={() => setErrorDialogOpen(false)}
      />
    </Box>
  );
}
