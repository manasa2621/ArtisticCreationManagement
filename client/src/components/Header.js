import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  header: {
    textAlign: "center",
    backgroundColor: "#378CE7", // Update to a different color
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          primary: {
            main: "#378CE7", // Update to match the background color
          },
        },
      })}
    >
      <AppBar position="static">
        <Toolbar>
          <Box className={classes.header} sx={{ width: "100%" }}>
            <Typography variant="h6" component="div">
              Artistic Creation Management
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
