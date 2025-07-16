import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAvailableRoomsByDateRange } from '../services/roomService'; // you'll create this

export default function CheckAvailability() {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [showNoRoomMsg, setShowNoRoomMsg] = useState(false);

    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!checkIn || !checkOut) {
            alert('Please enter both dates');
            return;
        }

        try {
            await getAvailableRoomsByDateRange(checkIn, checkOut).then((data) => {
                console.log(data);
                setAvailableRooms(data);
                if (data.length == 0) setShowNoRoomMsg(true);
            });

        } catch (err) {
            console.error(err);
            alert('Error fetching available rooms');
        }
    };

    const handleProceed = (room) => {
        navigate('/proceed-booking', {
            state: {
                selectedRoom: room,
                checkIn,
                checkOut
            }
        });
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Check Room Availability
            </Typography>

            <TextField
                fullWidth
                margin="normal"
                label="Check-In Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Check-Out Date"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
            />

            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSearch}>
                Check Availability
            </Button>

            {availableRooms.length > 0 && (
                <>
                    <Typography sx={{ mt: 3 }} variant="h6">Available Rooms:</Typography>
                    {availableRooms.map((room) => (
                        <Box key={room.roomId} sx={{ p: 1, border: '1px solid #ccc', mt: 1, borderRadius: 2 }}>
                            <Typography>Room ID: {room.roomId}</Typography>
                            <Typography>Room Type: {room.roomType}</Typography>
                            <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleProceed(room)}>
                                Book This Room
                            </Button>
                        </Box>
                    ))}
                </>
            )}

            {showNoRoomMsg && availableRooms.length === 0 && (
                <Typography sx={{ mt: 3 }} variant="body1" color="text.secondary">
                    There are no available rooms.
                </Typography>
            )}

        </Box>
    );
}


