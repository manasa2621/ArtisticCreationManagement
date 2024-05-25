import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [artistId, setArtistId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [typeOfUser, setTypeOfUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [contactNo, setContactNo] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('artist_id', artistId);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('type_of_user', typeOfUser);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profile_picture', profilePicture);
    formData.append('contact_no', contactNo);
    formData.append('username', username);

    try {
      const response = await axios.post('http://localhost:5000/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      navigate('/login');
      // Reset form fields after submission
      setArtistId('');
      setFirstName('');
      setLastName('');
      setTypeOfUser('');
      setEmail('');
      setPassword('');
      setProfilePicture(null);
      setContactNo('');
      setUsername('');
    } catch (error) {
      console.error('There was an error registering the user!', error);
    }
  };

  return (
    <div style={{ margin: 'auto', maxWidth: '500px' }}>
      <h1 style={{ textAlign: 'center' }}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField label="ID" value={artistId} onChange={(e) => setArtistId(e.target.value)} style={{ marginBottom: '20px' }} />
        <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ marginBottom: '20px' }} />
        <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ marginBottom: '20px' }} />
        <FormControl style={{ marginBottom: '20px' }}>
          <InputLabel>Type of User</InputLabel>
          <Select value={typeOfUser} onChange={(e) => setTypeOfUser(e.target.value)}>
            <MenuItem value="artist">Artist</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
          <FormHelperText>Select Type</FormHelperText>
        </FormControl>
        <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '20px' }} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '20px' }} />
        <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} style={{ marginBottom: '20px' }} />
        <TextField label="Contact No" value={contactNo} onChange={(e) => setContactNo(e.target.value)} style={{ marginBottom: '20px' }} />
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ marginBottom: '20px' }} />
        <Button type="submit" variant="contained" color="primary" style={{ alignSelf: 'center', marginBottom: '20px' }}>Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUpForm;
