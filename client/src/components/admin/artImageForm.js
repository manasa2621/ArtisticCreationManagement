import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import axios from "axios";

const ArtImageForm = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [itemsUsed, setItemsUsed] = useState("");
  const [price, setPrice] = useState("");
  const [caption, setCaption] = useState("");
  const [featured, setFeatured] = useState(false);
  const [availability, setAvailability] = useState("");
  const [artistId, setArtistId] = useState("");

  useEffect(() => {
    // Fetch artist_id from token in localStorage
    const artistId = localStorage.getItem("artist_id");
    console.log("Artist ID:", artistId); // Log the artist_id
    setArtistId(artistId);
  }, []);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form...");
    console.log("artistId:", artistId);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("items_used", itemsUsed);
    formData.append("price", price);
    formData.append("caption", caption);
    formData.append("featured", featured);
    formData.append("availability", availability);
    formData.append("artist_id", artistId);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      // Reset form fields after submission
      setImage(null);
      setCategory("");
      setDescription("");
      setItemsUsed("");
      setPrice("");
      setCaption("");
      setFeatured(false);
      setAvailability("");
    } catch (error) {
      console.error("There was an error uploading the data!", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: 500,
          margin: "auto",
          padding: "20px",
          boxShadow: "0px 3px 15px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          style={{ marginBottom: "20px", textAlign: "center" }}
        >
          Add New Art Image
        </Typography>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ marginBottom: "20px", width: "100%" }}
          />

          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="painting">Painting</MenuItem>
              <MenuItem value="sculpture">Sculpture</MenuItem>
              <MenuItem value="photography">Photography</MenuItem>
              <MenuItem value="digital-art">Digital Art</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            fullWidth
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: "20px" }}
          />

          <TextField
            label="Items Used"
            fullWidth
            value={itemsUsed}
            onChange={(e) => setItemsUsed(e.target.value)}
            style={{ marginBottom: "20px" }}
          />

          <TextField
            label="Price"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ marginBottom: "20px" }}
          />

          <TextField
            label="Caption"
            fullWidth
            multiline
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ marginBottom: "20px" }}
          />

          <FormGroup style={{ marginBottom: "20px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
              }
              label="Featured"
            />

            <FormControl fullWidth style={{ marginTop: "10px" }}>
              <InputLabel id="availability-label">Availability</InputLabel>
              <Select
                labelId="availability-label"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="out-of-stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </FormGroup>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
          >
            Add Art Image
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ArtImageForm;
