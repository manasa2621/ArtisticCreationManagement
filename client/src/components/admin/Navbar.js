import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles"; // Import makeStyles from @mui/styles
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "space-between",
  },
  linkButton: {
    textDecoration: "none",
    color: "inherit",
  },
}));

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("artist_id");
    navigate("/");
  };

  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" component="div">
          Art Gallery
        </Typography>
        <div>
          <Button
            color="inherit"
            component={RouterLink}
            to="/view-purchase-details"
            className={classes.linkButton}
          >
            View Purchase Details
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/add-art-details"
            className={classes.linkButton}
          >
            Art Details
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/view-profile"
            className={classes.linkButton}
          >
            View Profile
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/congrats"
            className={classes.linkButton}
          >
            View achievement
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
