import { useEffect, useState } from "react";
import { getAllBookings } from "../services/bookingService";
import Chatbot from "../components/Chatbot";

import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Box,
  Button
} from "@mui/material";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);


  useEffect(() => {
    getAllBookings().then((data)=>{
      console.log(data);
      setBookings(data);
    });
  }, []);

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Bookings
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>Booking Id</strong></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>Room Id</strong></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><strong>Customer Id</strong></TableCell>
                <TableCell><strong>Check In</strong></TableCell>
                <TableCell><strong>Check Out</strong></TableCell>
                <TableCell><strong>Special Requests</strong></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell >{b.bookingId}</TableCell>
                  <TableCell>{b.roomId}</TableCell>
                  <TableCell>{b.customerId}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(b.checkInDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {new Date(b.checkOutDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {b.specialRequests && b.specialRequests.length > 0 ? (
                      <ul style={{ paddingLeft: '1rem', margin: 0, lineHeight: '1.6' }}>
                        {b.specialRequests.map((r) => (
                          <li key={r.requestId} style={{ whiteSpace: 'nowrap' }}>{r.description}</li>
                        ))}
                      </ul>
                    ) : (
                      'None'
                    )}
                  </TableCell>


                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999
        }}
      >
        {chatOpen && (
          <Box sx={{ width: 360 }}>
            <Chatbot />
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setChatOpen(!chatOpen)}
          sx={{ mt: 1 }}
        >
          {chatOpen ? 'Close Chat' : 'Chat 💬'}
        </Button>
      </Box>
    </div>
  );
}
