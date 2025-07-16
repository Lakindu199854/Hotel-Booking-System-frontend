import React, { useEffect, useState } from 'react';
import { createRoom, getAllRooms } from '../services/roomService';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { data } from 'react-router-dom';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomId: '',
    roomNumber: '',
    roomType: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    getAllRooms().then((data)=>{setRooms(data)});
     
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRoom = () => {
    createRoom(newRoom)
      .then(() => {
        fetchRooms();
        setOpenDialog(false);
        setNewRoom({ number: '', type: '', price: '' });
      })
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Rooms
      </Typography>

      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
        Add New Room
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room Id</TableCell>
            <TableCell>Room Number</TableCell>
            <TableCell>Room Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.roomId}>
              <TableCell>{room.roomId}</TableCell>
              <TableCell>{room.roomNumber}</TableCell>
              <TableCell>{room.roomType}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Room Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Room Id"
            name="roomId"
            value={newRoom.roomId}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Room Number"
            name="roomNumber"
            value={newRoom.type}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Room Type"
            name="roomType"
            type="string"
            value={newRoom.price}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRoom} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
