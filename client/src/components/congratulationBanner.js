import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { Favorite as FavoriteIcon } from "@mui/icons-material";
import Navbar from "./admin/Navbar";
import { useNavigate } from "react-router-dom";

const congratsBannerStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start", // Align content at the top
  height: "100vh",
  backgroundColor: "#a9dfbf", // Light green background color
  overflow: "hidden", // Hide overflowing content
  animation: "fadeIn 1s ease", // Animation
  padding: "16px", // Add some padding
};

const congratsIconStyle = {
  fontSize: 64,
  color: "#ffffff", // White color for the icon
  marginBottom: 16, // You can adjust this as needed
};

const artDetailsStyle = {
  textAlign: "center",
  width: "100%",
  marginTop: "32px", // Add margin between sections
};

const CongratulationsBanner = () => {
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  // Retrieve mostLikedArt from local storage
  const mostLikedArt = JSON.parse(localStorage.getItem("mostLikedArt"));

  const handleFeedbackSubmit = () => {
    // Perform submission logic here
    // For now, just show an alert and navigate to add-art-details
    alert("Thanks for feedback!");
    navigate("/add-art-details");
  };

  return (
    <div>
      <Navbar />

      <Box sx={congratsBannerStyle}>
        <Box sx={{ marginTop: "16px" }}>
          <FavoriteIcon sx={congratsIconStyle} />
        </Box>
        <Typography variant="h4" align="center" color="white" gutterBottom>
          Congratulations! You have the most liked art.
        </Typography>
        {mostLikedArt && (
          <Box sx={artDetailsStyle}>
            <Typography variant="h5" gutterBottom color="white">
             Art Id: {mostLikedArt.id}
            </Typography>
            <Typography variant="h5" gutterBottom color="white">
              {mostLikedArt.caption}
            </Typography>
            <Typography variant="body1" gutterBottom color="white">
              Category: {mostLikedArt.category}
            </Typography>
            <Typography variant="body1" gutterBottom color="white">
              Description: {mostLikedArt.description}
            </Typography>
            <Typography variant="body1" gutterBottom color="white">
              Price: {mostLikedArt.price}
            </Typography>
            <TextField
              id="feedback"
              label="Provide Feedback"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ marginTop: "16px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFeedbackSubmit}
              sx={{ marginTop: "16px" }}
            >
              Submit Feedback
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default CongratulationsBanner;
