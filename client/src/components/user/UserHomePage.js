import React, { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  IconButton,
  Grid,
  Container,
  TextField,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Favorite,
  Share,
  ShoppingCart,
  Comment,
  AddShoppingCart,
} from "@mui/icons-material";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#A0DEFF",
    padding: "20px 0",
  },
  card: {
    maxWidth: 345,
    margin: "auto",
    borderRadius: 15,
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    background: "#FF70AB",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  media: {
    height: 300,
    cursor: "pointer",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FF70AB",
    padding: "16px",
    borderRadius: "0 0 15px 15px",
  },
  caption: {
    fontStyle: "italic",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  commentBox: {
    width: "100%",
  },
  cardActions: {
    justifyContent: "space-around",
    backgroundColor: "#FF70AB",
    borderRadius: "0 0 15px 15px",
  },
  commentSection: {
    marginTop: 8,
  },
  priceButton: {
    color: "#fff",
    background: "#4caf50",
    "&:hover": {
      background: "#388e3c",
    },
  },
}));

const UserHomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [arts, setArts] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [commentOpen, setCommentOpen] = useState({});
  const [commentText, setCommentText] = useState({});
  const [likes, setLikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchLikesAndStoreMostLiked = async () => {
      try {
        const response = await axios.get("http://localhost:5000/arts");
        if (response.status === 200) {
          const availableArts = response.data.filter(
            (art) => art.availability !== "out-of-stock"
          );
          const transformedArts = availableArts.map((art) => ({
            id: art.id,
            artist_id: art.artist_id,
            category: art.category,
            description: art.description,
            items_used: art.items_used,
            price: art.price,
            caption: art.caption,
            featured: art.featured,
            image_data: art.image_data
              ? `data:image/png;base64,${art.image_data}`
              : null,
          }));

          let mostLikedArt = null;
          let maxLikes = 0;

          for (const art of transformedArts) {
            const likeCountResponse = await axios.get(
              `http://localhost:5000/likes?art_image_id=${art.id}`
            );
            if (likeCountResponse.status === 200) {
              const likesCount = likeCountResponse.data.likes;
              setLikeCounts((prevLikeCounts) => ({
                ...prevLikeCounts,
                [art.id]: likesCount,
              }));

              if (likesCount > maxLikes) {
                maxLikes = likesCount;
                mostLikedArt = art;
              }
            }
          }

          // Store the most liked art in local storage
          if (mostLikedArt) {
            localStorage.setItem("mostLikedArt", JSON.stringify(mostLikedArt));
          }

          // Set arts state
          setArts(transformedArts);
        }
      } catch (error) {
        console.error("Failed to fetch arts:", error);
      }
    };

    fetchLikesAndStoreMostLiked();
  }, []);

  useEffect(() => {
    const uniqueCategories = [...new Set(arts.map((art) => art.category))];
    setCategories(uniqueCategories);
  }, [arts]);

  const handleImageClick = (art) => {
    setSelectedArt(art);
  };

  const handleCommentClick = (id) => {
    setCommentOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseSnackbar = () => {
    setCopySuccess(false);
  };

  const handleCommentChange = (id, value) => {
    setCommentText((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCommentSubmit = (id) => {
    console.log(`Comment for art ${id}: ${commentText[id]}`);
    setCommentOpen((prev) => ({
      ...prev,
      [id]: false,
    }));
    setCommentText((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleLikeClick = async (id) => {
    try {
      const artist_id = localStorage.getItem("artist_id");
      if (!artist_id) {
        console.error("artist ID not found in localStorage");
        return;
      }

      const response = await axios.post("http://localhost:5000/like", {
        user_id: parseInt(artist_id),
        art_image_id: id,
      });

      if (response.status === 201 || response.status === 200) {
        const updatedLikeStatus = !likes[id]; // Toggle like status for clicked image
        setLikes((prevLikes) => ({
          ...prevLikes,
          [id]: updatedLikeStatus,
        }));

        // Fetch updated like count for the clicked image
        const likeCountResponse = await axios.get(
          `http://localhost:5000/likes?art_image_id=${id}`
        );
        if (likeCountResponse.status === 200) {
          const newCount = likeCountResponse.data.likes;
          setLikeCounts((prevLikeCounts) => ({
            ...prevLikeCounts,
            [id]: updatedLikeStatus ? newCount + 1 : newCount - 1,
          }));
        }
      } else {
        console.error("Failed to like/unlike art image");
      }
    } catch (error) {
      console.error("Error liking/unliking art image:", error);
    }
  };

  const handlePurchaseClick = (id) => {
    navigate(`/purchase?id=${id}`);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
  };

  const handleCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue === "All" ? "" : selectedValue);
  };

  const filteredArts = selectedCategory
    ? arts.filter((art) => art.category === selectedCategory)
    : arts;

  return (
    <div>
      <Navbar />
      <Box className={classes.root}>
        <Container>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            displayEmpty
            className={classes.select}
            inputProps={{ "aria-label": "Select category" }}
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="All">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
          <Grid container spacing={4}>
            {filteredArts.map((art) => (
              <Grid item key={art.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  {art.image_data && (
                    <div>
                      <CardMedia
                        className={classes.media}
                        image={art.image_data}
                        title={art.category}
                        onClick={() => handleImageClick(art)}
                      />
                      {selectedArt === art && (
                        <CardContent className={classes.cardContent}>
                          <Typography variant="h6" color="text.primary">
                            Items Used:
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {Array.isArray(art.items_used)
                              ? art.items_used.join(", ")
                              : art.items_used}
                          </Typography>
                        </CardContent>
                      )}
                    </div>
                  )}
                  <CardContent className={classes.cardContent}>
                    <Typography variant="body2" className={classes.caption}>
                      {art.caption}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      Price: {art.price}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Likes:{" "}
                      {likeCounts[art.id] === null
                        ? "Loading..."
                        : likeCounts[art.id]}
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <IconButton
                      aria-label="add to favorites"
                      color={likes[art.id] ? "secondary" : "default"}
                      onClick={() => handleLikeClick(art.id)}
                    >
                      <Favorite />
                    </IconButton>

                    <IconButton aria-label="share" onClick={handleShareClick}>
                      <Share />
                    </IconButton>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCart />}
                      className={classes.priceButton}
                      onClick={() => handlePurchaseClick(art.id)}
                    >
                      Purchase
                    </Button>

                    <IconButton
                      aria-label="comment"
                      onClick={() => handleCommentClick(art.id)}
                    >
                      <Comment />
                    </IconButton>
                  </CardActions>
                  {commentOpen[art.id] && (
                    <CardContent className={classes.commentSection}>
                      <TextField
                        className={classes.commentBox}
                        label="Add a comment"
                        variant="outlined"
                        multiline
                        rows={2}
                        value={commentText[art.id] || ""}
                        onChange={(e) =>
                          handleCommentChange(art.id, e.target.value)
                        }
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCommentSubmit(art.id)}
                      >
                        Submit
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />
    </div>
  );
};

export default UserHomePage;
