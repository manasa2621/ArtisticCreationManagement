import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../user/Navbar';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function Purchase() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id'); // Get the ID from the query string
  const [art, setArt] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const response = await axios.get('http://localhost:5000/arts');
        if (response.status === 200) {
          const allArts = response.data;
          const selectedArt = allArts.find((art) => art.id.toString() === id);
          if (selectedArt) {
            setArt(selectedArt);
            setTotalPrice(selectedArt.price);
          }
        }
      } catch (error) {
        console.error('Failed to fetch arts:', error);
      }
    };

    if (id) {
      fetchArt();
    }
  }, [id]);

  useEffect(() => {
    if (art) {
      setTotalPrice(art.price * quantity);
    }
  }, [quantity, art]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const handlePurchase = async () => {
    const artistId = localStorage.getItem('artist_id');
    if (!artistId) {
      console.error('No artist_id found in local storage');
      return;
    }

    try {
      await axios.post('http://localhost:5000/purchase', {
        artId: id,
        userId: artistId, // Send artist_id as user_id
        quantity,
        price: art.price, // Send the individual item price
        address, // Include the address in the purchase data
        email, // Include the email in the purchase data
        zipCode, // Include the zip code in the purchase data
        deliveryInstructions, // Include delivery instructions in the purchase data
      });
      setAddressDialogOpen(false);
      setInvoiceDialogOpen(true); // Open the invoice dialog
    } catch (error) {
      console.error('Failed to complete the purchase:', error);
    }
  };

  const handleInvoiceClose = () => {
    setInvoiceDialogOpen(false);
    alert('Purchase completed successfully!');
    setFeedbackDialogOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    const artistId = localStorage.getItem('artist_id');
    if (!artistId) {
      console.error('No artist_id found in local storage');
      return;
    }

    try {
      await axios.post('http://localhost:5000/feedback', {
        user_id: artistId,
        art_id: id,
        feedback,
        rating,
      });
      setFeedbackDialogOpen(false);
      alert('Thanks for providing feedback!');
      navigate('/user-home');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (!id) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          No ID provided in URL.
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Purchase Art
        </Typography>
        {art && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price per Unit</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{art.caption}</TableCell>
                  <TableCell>{art.description}</TableCell>
                  <TableCell>{art.category}</TableCell>
                  <TableCell>{art.price}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>{totalPrice}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddressDialogOpen(true)}
          disabled={!art}
          style={{ marginTop: '20px' }}
        >
          Buy
        </Button>
      </Container>

      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)}>
        <DialogTitle>Enter Your Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Address"
            multiline
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <TextField
            label="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            fullWidth
          />
          <TextField
            label="Delivery Instructions"
            multiline
            rows={2}
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePurchase} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={invoiceDialogOpen} onClose={handleInvoiceClose}>
        <DialogTitle>Invoice</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Name: {name}</Typography>
          <Typography variant="body1">Contact Number: {contactNumber}</Typography>
          <Typography variant="body1">Email: {email}</Typography>
          <Typography variant="body1">Address: {address}</Typography>
          <Typography variant="body1">Zip Code: {zipCode}</Typography>
          <Typography variant="body1">Delivery Instructions: {deliveryInstructions}</Typography>
          <Typography variant="body1">--------------------------------------</Typography>
          <Typography variant="body1">Art: {art?.caption}</Typography>
          <Typography variant="body1">Description: {art?.description}</Typography>
          <Typography variant="body1">Category: {art?.category}</Typography>
          <Typography variant="body1">Price per Unit: {art?.price}</Typography>
          <Typography variant="body1">Quantity: {quantity}</Typography>
          <Typography variant="body1">Total Price: {totalPrice}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInvoiceClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <TextField
            label="Feedback"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            fullWidth
          />
          <TextField
            label="Rating (1-5)"
            type="number"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            inputProps={{ min: 1, max: 5 }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFeedbackSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
