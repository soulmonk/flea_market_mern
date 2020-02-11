import React, { useState } from "react";
import { BrowserRouter as Router, Link as RLink, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import PrivateRoute from './PrivateRoute';
import Home from "./pages/Home";
import { AuthContext } from "./context/auth";
import Signup from './pages/Signup';
import SignIn from './pages/SignIn'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';
import IsNotLoggedRoute from './IsNotLoggedRoute'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));


function App() {
  let tokens = localStorage.getItem("tokens");
  if (tokens) {
    tokens = JSON.parse(tokens)
  }
  const [authTokens, setAuthTokens] = useState(tokens);
  const [isLoggedIn, setLoggedIn] = useState(!!tokens);

  const classes = useStyles();

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  const logout = () => {
    setLoggedIn(false)
    setTokens(null)
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Todo
          </Typography>
          {authTokens && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>
      <Router>
        <div className="App">
          <PrivateRoute exact path="/" component={Home} />
          <IsNotLoggedRoute path="/signup" component={Signup} />
          <IsNotLoggedRoute path="/login" component={SignIn} />
        </div>
      </Router>
    </AuthContext.Provider>
  );

}

export default App;
