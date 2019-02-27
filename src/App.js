/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";
import jwt_decode from "jwt-decode";
import AlertTemplate from "react-alert-template-basic";
import "./App.css";
import store from "./store";
import Toolbar from "./components/Toolbar/Toolbar";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
import Login from "./components/Authentication/Login/Login";
import Register from "./components/Authentication/Register/Register";
import Forgot from "./components/Authentication/Reset-Password/Forgot";
import Reset from "./components/Authentication/Reset-Password/Reset";
import { setCurrent, logoutUser } from "./actions/authActions";
import setAuthToken from "./utils/setAuthToken";
import { loadReCaptcha } from "react-recaptcha-google";
import DrumMachine from "./components/DrumMachine";

if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode token and get user info
  store.dispatch(setCurrent(localStorage.jwtToken));
  // Check for expired token
  // const currentTime = Date.now() / 1000;
  // if(jwt_decode(localStorage.jwt_decode).exp < currentTime){
  //   store.dispatch(logoutUser());
  //   // Redirect to login
  //   window.location.href = '/login';
  // }
}
const options = {
  position: "top center",
  timeout: 3000,
  offset: "30px",
  transition: "scale",
  type: "success"
};
class App extends Component {
  state = {
    SideDrawerOpen: false
  };
  componentDidMount() {
    loadReCaptcha();
  }
  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { SideDrawerOpen: !prevState.SideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({ SideDrawerOpen: false });
  };

  render() {
    let backdrop;

    if (this.state.SideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <Provider store={store}>
        <div className="App">
          <AlertProvider template={AlertTemplate} {...options}>
            <Router>
              <div>
                <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
                <SideDrawer show={this.state.SideDrawerOpen} />
                {backdrop}
                <main className="mainContainer">
                  <Route exact path="/" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route path="/drum" component={DrumMachine} />
                  <Route path="/register" component={Register} />
                  <Route path="/forgot" component={Forgot} />
                  <Route
                    path="/reset/:id"
                    render={({ match }) => <Reset id={match.params.id} />}
                  />
                </main>
              </div>
            </Router>
          </AlertProvider>
        </div>
      </Provider>
    );
  }
}

export default App;
