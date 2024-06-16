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
  CircularProgress,
  AppBar,
  Button,
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ViewTransaction = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/view-items');
        setItems(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
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
            Transactions
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Art ID</TableCell>
                  <TableCell>Artist ID</TableCell>
                  <TableCell>Caption</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Feedback</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>User ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.art_id}>
                    <TableCell>
                      <img 
                        src={`data:image/png;base64,${item.image}`} 
                        alt={item.caption} 
                        style={{ width: '100px', height: 'auto' }}
                      />
                    </TableCell>
                    <TableCell>{item.art_id}</TableCell>
                    <TableCell>{item.artist_id}</TableCell>
                    <TableCell>{item.caption}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.feedback}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.total_price.toFixed(2)}</TableCell>
                    <TableCell>{item.rating}</TableCell>
                    <TableCell>{item.user_id}</TableCell>
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

export default ViewTransaction;
