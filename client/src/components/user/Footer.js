import React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: "gray",
    color: "#fff",
    textAlign: "center",
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.footer}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
