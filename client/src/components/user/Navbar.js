import React from "react";
import { AppBar, Toolbar, Typography, Button} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "gray",
  },
  title: {
    flexGrow: 1,
  },
  button: {
    color: "#fff",
    textTransform: "none",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("artist_id");
    navigate("/login");
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Artistic Creation Management
        </Typography>
        <Button
          component={RouterLink}
          to="/user-home"
          className={classes.button}
        >
          Home
        </Button>
        <Button
          component={RouterLink}
          to="/view-user-profile"
          className={classes.button}
        >
          View Profile
        </Button>
        <Button
          component={RouterLink}
          to="/view-purchase-history"
          className={classes.button}
        >
          View Purchase History
        </Button>
        <Button
          component={RouterLink}
          to="/contact-us"
          className={classes.button}
        >
          Contact us
        </Button>
        <Button onClick={handleLogout} className={classes.button}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
