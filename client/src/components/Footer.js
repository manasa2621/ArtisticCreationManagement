import React from "react";
import { Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: "#378CE7", // Forest green color
    color: "white",
    textAlign: "center",
    padding: "16px", // Adjust the padding as needed
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: {
            main: "#378CE7",
          },
        },
      })}
    >
      <Box className={classes.footer} component="footer">
        <Typography variant="body1">
          &copy; 2024 artistic creation management. All rights reserved.
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default Footer;
