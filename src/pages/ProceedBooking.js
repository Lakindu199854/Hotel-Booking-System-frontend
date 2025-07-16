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
    Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getAllSpecialRequest } from '../services/specialRequest';
import { createBooking } from '../services/bookingService';
import ErrorDialog from '../components/ErrorDialog';


export default function ProceedBooking() {
    const location = useLocation();
    const { selectedRoom, checkIn, checkOut } = location.state;

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceCount, setRecurrenceCount] = useState('');
    const [recurrenceType, setRecurrenceType] = useState('weekly');
    const [specialRequests, setSpecialRequest] = useState([]);
    const [selectedRequests, setSelectedRequests] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    useEffect(() => {
        getAllSpecialRequest().then(setSpecialRequest);
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

        if (!customer.name || !customer.email || !customer.phone) {
            alert('Please fill all customer fields');
            return;
        }

        const bookingData = {
            customer: { ...customer },
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
            //Clear form fields
            setCustomer({ name: '', email: '', phone: '' });
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
            <Typography variant="h5" gutterBottom>
                Confirm Booking
            </Typography>

            <Typography variant="body1">Room ID: {selectedRoom.roomId}</Typography>
            <Typography variant="body1">Room Type: {selectedRoom.roomType}</Typography>
            <Typography variant="body1">Check-In: {checkIn}</Typography>
            <Typography variant="body1">Check-Out: {checkOut}</Typography>

            <form onSubmit={handleSubmit}>
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

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Special Requests
                </Typography>
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

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Confirm Booking
                </Button>
            </form>
            <ErrorDialog
                open={errorDialogOpen}
                message={errorMessage}
                onClose={() => setErrorDialogOpen(false)}
            />


        </Box>
    );
}
