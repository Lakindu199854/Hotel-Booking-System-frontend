import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  TableContainer,
  TextField,
  Box,
  Button
} from '@mui/material';

import { getAllBookings } from '../services/bookingService';
import { getAllCustomers } from '../services/customerService';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [customers, setCustomers] = useState([]);
  const [weeklyData, setWeeklyData] = useState({});

  useEffect(() => {
    getAllBookings().then(setReports);
    getAllCustomers().then(setCustomers);
  }, []);

  // Handles both object and numeric customerId
  const getCustomerName = (customerObj) => {
    if (!customerObj || typeof customerObj !== 'object') return 'N/A';
    return customerObj.name || 'N/A';
  };

  // Filter bookings for selected week (startDate to startDate + 6 days)
  const filteredReports = reports.filter((r) => {
    if (!startDate) return true;

    const checkIn = new Date(r.checkInDate);
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return checkIn >= start && checkIn <= end;
  });

  // Group filtered bookings by day of week
  useEffect(() => {
    const grouped = {};
    filteredReports.forEach((b) => {
      const day = format(new Date(b.checkInDate), 'EEEE');
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(b);
    });
    setWeeklyData(grouped);
  }, [filteredReports]);

  // Download PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Weekly Booking Report', 14, 22);

    let yOffset = 30;

    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      doc.setFontSize(12);
      doc.text(`Date Range: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`, 14, yOffset);
      yOffset += 10;
    }

    const tableColumn = ["Booking ID", "Customer", "Room", "Check-In", "Check-Out", "Requests"];

    Object.keys(weeklyData).forEach((day) => {
      const dayBookings = weeklyData[day];

      doc.setFontSize(14);
      doc.text(day, 14, yOffset);
      yOffset += 6;

      const tableRows = dayBookings.map((b) => [
        b.bookingId,
        getCustomerName(b.customerId),
        `${b.roomId?.roomNumber} (${b.roomId?.roomType})`,
        new Date(b.checkInDate).toLocaleString(),
        new Date(b.checkOutDate).toLocaleString(),
        b.specialRequests?.map(r => r.description).join(', ') || 'None'
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: yOffset,
        styles: { fontSize: 10 },
        theme: 'grid',
        didDrawPage: (data) => {
          yOffset = data.cursor.y + 10;
        }
      });
    });

    doc.save("weekly-booking-report.pdf");
  };

  const columnStyles = {
    bookingId: { width: '100px' },
    customer: { width: '220px' },
    room: { width: '80px' },
    checkIn: { width: '180px' },
    checkOut: { width: '180px' },
    recurring: { width: '100px' },
    requests: { width: '200px' },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Reports
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Select Week Starting"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </Box>

      {startDate && (
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Showing bookings from <strong>{new Date(startDate).toLocaleDateString()}</strong> to <strong>{new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 6)).toLocaleDateString()}</strong>
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={downloadPdf} sx={{ mb: 2 }}>
        Download PDF
      </Button>

      <Typography variant="h5" mt={5} gutterBottom>
        Weekly View
      </Typography>

      {Object.keys(weeklyData).map((day) => (
        <Box key={day} mb={4}>
          <Typography variant="h6" gutterBottom>{day}</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={columnStyles.bookingId}><strong>Booking ID</strong></TableCell>
                  <TableCell sx={columnStyles.customer}><strong>Customer</strong></TableCell>
                  <TableCell sx={columnStyles.room}><strong>Room</strong></TableCell>
                  <TableCell sx={columnStyles.checkIn}><strong>Check-In</strong></TableCell>
                  <TableCell sx={columnStyles.checkOut}><strong>Check-Out</strong></TableCell>
                  <TableCell sx={columnStyles.requests}><strong>Requests</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weeklyData[day].map((b) => (
                  <TableRow key={b.bookingId}>
                    <TableCell sx={columnStyles.bookingId}>{b.bookingId}</TableCell>
                    <TableCell sx={columnStyles.customer}>{getCustomerName(b.customerId)}</TableCell>
                    <TableCell sx={columnStyles.room}>
                      {b.roomId?.roomNumber} ({b.roomId?.roomType})
                    </TableCell>
                    <TableCell sx={columnStyles.checkIn}>{new Date(b.checkInDate).toLocaleString()}</TableCell>
                    <TableCell sx={columnStyles.checkOut}>{new Date(b.checkOutDate).toLocaleString()}</TableCell>
                    <TableCell sx={columnStyles.requests}>
                      {b.specialRequests?.length > 0
                        ? b.specialRequests.map(r => r.description).join(', ')
                        : 'None'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Container>
  );
}
