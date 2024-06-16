import React, { useEffect, useState } from 'react';
import { AppBar, Button, Card, CardContent, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminArts = () => {
  const navigate = useNavigate();
  const [arts, setArts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/arts')
      .then(response => setArts(response.data))
      .catch(error => console.error('Error fetching arts:', error));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/delete/${id}`)
      .then(response => {
        console.log(response.data);
        setArts(arts.filter(art => art.id !== id));
      })
      .catch(error => console.error('Error deleting art:', error));
  };

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
      <Container component="main" sx={{ flexGrow: 1, paddingTop: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Arts
        </Typography>
        {arts.map(art => (
          <Card key={art.id} sx={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">Category: {art.category}</Typography>
              <Typography variant="body1">ID: {art.id}</Typography>
              <Typography variant="body1">Artist ID: {art.artist_id}</Typography>
              <Typography variant="body1">Caption: {art.caption}</Typography>
              <Typography variant="body1">Description: {art.description}</Typography>
              <Typography variant="body1">Items Used: {art.items_used}</Typography>
              <Typography variant="body1">Price: {art.price}</Typography>
              <Typography variant="body1">Availability: {art.availability}</Typography>
              <Typography variant="body1">Featured: {art.featured ? 'Yes' : 'No'}</Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleDelete(art.id)}
                sx={{ marginTop: '8px' }}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </Container>
      <footer style={{ marginTop: 'auto', textAlign: 'center', backgroundColor: '#004080', padding: '20px', color: '#fff' }}>
        &copy; {new Date().getFullYear()} Artistic Creation Management. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminArts;
