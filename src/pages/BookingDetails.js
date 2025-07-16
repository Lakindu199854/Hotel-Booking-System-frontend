import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Paper, List, ListItem, ListItemText, Divider
} from '@mui/material';
import axios from 'axios';

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);


    useEffect(() => {
      getBookingById(id).then(setBooking);
    }, [id]);
  

  if (!booking) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Booking #{booking.bookingId}</Typography>

        <Typography><strong>Room ID:</strong> {booking.roomId}</Typography>
        <Typography><strong>Customer ID:</strong> {booking.customerId}</Typography>
        <Typography><strong>Check-In:</strong> {booking.checkInDate}</Typography>
        <Typography><strong>Check-Out:</strong> {booking.checkOutDate}</Typography>
        <Typography><strong>Recurring:</strong> {booking.isRecurring ? 'Yes' : 'No'}</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Special Requests</Typography>
        <List>
          {booking.specialRequests && booking.specialRequests.length > 0 ? (
            booking.specialRequests.map(req => (
              <ListItem key={req.requestId}>
                <ListItemText primary={req.description} />
              </ListItem>
            ))
          ) : (
            <ListItem><ListItemText primary="No special requests" /></ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}
