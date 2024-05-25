// ArtDetailsPage.js
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Navbar from "./Navbar";
import "./ArtDetailsPage.css"; // Import external stylesheet

const useStyles = makeStyles({
  root: {
    maxWidth: 1000,
    margin: "auto",
    marginTop: 20,
    padding: 16,
  },
  addButton: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
    },
    width: 300,
  },
  media: {
    height: 200,
    backgroundSize: "contain",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  cardActions: {
    justifyContent: "center",
  },
  cardTitle: {
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#333", // Dark gray color
  },
  cardText: {
    marginBottom: 8,
    textAlign: "left",
    color: "#555", // Gray color
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
});

const ArtDetailsPage = () => {
  const classes = useStyles();
  const [arts, setArts] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({
    category: "",
    description: "",
    items_used: "",
    price: "",
    caption: "",
    featured: false,
    availability: "",
  });

  useEffect(() => {
    fetchArts();
  }, []);

  const fetchArts = async () => {
    try {
      // Retrieve artist_id from localStorage
      const artistId = localStorage.getItem("artist_id");
      if (!artistId) {
        throw new Error("Artist ID not found in localStorage");
      }
      console.log("Artist ID from localStorage:", artistId);

      // Fetch all arts
      const response = await fetch("http://localhost:5000/arts");
      if (!response.ok) {
        throw new Error("Failed to fetch arts");
      }
      const artsData = await response.json();
      console.log("Fetched arts data:", artsData);

      // Filter arts based on artist_id
      const filteredArts = artsData.filter(
        (art) => String(art.artist_id) === artistId
      );
      console.log("Filtered arts data:", filteredArts);

      const transformedArts = filteredArts.map((art) => ({
        id: art.id,
        category: art.category,
        description: art.description,
        items_used: art.items_used,
        price: art.price,
        caption: art.caption,
        featured: art.featured,
        availability: art.availability,
        image_data: art.image_data
          ? `data:image/png;base64,${art.image_data}`
          : null,
      }));

      setArts(transformedArts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete art");
      }
      setArts(arts.filter((art) => art.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateClick = (art) => {
    setSelectedArt(art);
    setFormValues(art);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedArt(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/arts/${selectedArt.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update art");
      }
      const updatedArt = await response.json();
      setArts(arts.map((art) => (art.id === updatedArt.id ? updatedArt : art)));
      handleCloseDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={classes.root}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/admin-home"
          className={classes.addButton}
        >
          Add New Art
        </Button>
        <Typography variant="h5" gutterBottom align="center" className="title">
          Art Details
        </Typography>
        <div className={classes.container}>
          {arts.map((art) => (
            <Card key={art.id} className={classes.card}>
              {art.image_data && (
                <CardMedia
                  className={classes.media}
                  image={art.image_data}
                  title={art.category}
                />
              )}
              <CardContent className={classes.cardContent}>
                <Typography variant="h6" className={classes.cardTitle}>
                  Category: {art.category}
                </Typography>
                <Typography variant="body1" className={classes.cardText}>
                  <b>Description:</b> {art.description}
                </Typography>
                <Typography variant="body1" className={classes.cardText}>
                  <b>Items Used:</b> {art.items_used}
                </Typography>
                <Typography variant="body1" className={classes.cardText}>
                  <b>Price:</b> {art.price}
                </Typography>
                <Typography variant="body1" className={classes.cardText}>
                  <b>Caption:</b> {art.caption}
                </Typography>
                <Typography variant="body1" className={classes.cardText}>
                  <b>Featured:</b> {art.featured ? "Yes" : "No"}
                </Typography>
                <Typography variant="body1" className={classes.cardText}>
                  <b>Availability:</b> {art.availability}
                </Typography>
              </CardContent>
              <CardActions className={classes.cardActions}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleUpdateClick(art)}
                >
                  Update
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  className={classes.deleteButton}
                  onClick={() => handleDelete(art.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Art</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category"
            name="category"
            value={formValues.category}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Items Used"
            name="items_used"
            value={formValues.items_used}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            value={formValues.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Caption"
            name="caption"
            value={formValues.caption}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Availability"
            name="availability"
            value={formValues.availability}
            onChange={handleChange}
            fullWidth
          />
          <div>
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formValues.featured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ArtDetailsPage;
