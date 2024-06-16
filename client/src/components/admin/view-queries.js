import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { AppBar, Button,  Toolbar} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/getcontacts');
        setQueries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching queries:', error);
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <div style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="static" style={{ backgroundColor: '#004080' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Artistic Creation Management
        </Typography>
        <Button color="inherit" onClick={() => navigate('/admins-home')}>Manage Users</Button>
        <Button color="inherit" onClick={() => navigate('/admin-arts')}>Manage Arts</Button>
        <Button color="inherit" onClick={() => navigate('/view-queries')}>View Queries</Button>
        <Button color="inherit" onClick={() => navigate('/view-transaction')}>View Transactions</Button>
        <Button color="inherit" onClick={() => navigate('/login')}>Logout</Button>
      </Toolbar>
    </AppBar>
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Queries
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Artist ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>{query.id}</TableCell>
                  <TableCell>{query.artist_id}</TableCell>
                  <TableCell>{query.name}</TableCell>
                  <TableCell>{query.email}</TableCell>
                  <TableCell>{query.subject}</TableCell>
                  <TableCell>{query.message}</TableCell>
                  <TableCell>{new Date(query.submitted_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
    </div>
  );
};

export default ViewQueries;
