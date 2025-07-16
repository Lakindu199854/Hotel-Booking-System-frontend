import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

import AllBookings from './pages/AllBookings';
import AddBooking from './pages/AddBooking';
import ManageRooms from './pages/ManageRooms';
import CheckAvailability from './pages/CheckAvailability';
import ProceedBooking from './pages/ProceedBooking';
import Reports from './pages/Reports';
function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Hotel Manager
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/booking-list">All Bookings</Button>
          <Button color="inherit" component={Link} to="/manage-rooms">Manage Rooms</Button>
          <Button color="inherit" component={Link} to="/reports">Reports</Button>
          
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4 }}>
        <Routes>
          <Route path="/booking-list" element={<AllBookings />} />
          <Route path="/manage-rooms" element={<ManageRooms />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/" element={<CheckAvailability />} />
          <Route path="/check-availability" element={<CheckAvailability />} />
          <Route path="/proceed-booking" element={<ProceedBooking />} />

        </Routes>
      </Box>
    </Router>
  );
}

export default App;
