import React, { useEffect, useState } from 'react';
import { AppBar, Button, Card, CardContent, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminHome = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/getusers')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDelete = (artist_id) => {
    axios.delete(`http://localhost:5000/deleteuser?id=${artist_id}`)
      .then(response => {
        console.log(response.data);
        setUsers(users.filter(user => user.artist_id !== artist_id));
      })
      .catch(error => console.error('Error deleting user:', error));
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
          Manage Users
        </Typography>
        {users.map(user => (
          <Card key={user.artist_id} sx={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">Username: {user.username}</Typography>
              <Typography variant="body1">Artist ID: {user.artist_id}</Typography>
              <Typography variant="body1">Email: {user.email}</Typography>
              <Typography variant="body1">Contact No: {user.contact_no}</Typography>
              <Typography variant="body1">First Name: {user.first_name}</Typography>
              <Typography variant="body1">Last Name: {user.last_name}</Typography>
              <Typography variant="body1">Type of User: {user.type_of_user}</Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleDelete(user.artist_id)}
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

export default AdminHome;
