/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { withAlert } from "react-alert";
import InputLabel from "@material-ui/core/InputLabel";
const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
        alignTtems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center"
    },
    textField: {
        marginRight: "auto",
        marginLeft: "auto",
        width: 200
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    },
    card: {
        width: 400,
        marginRight: "auto",
        marginLeft: "auto",
        marginTop: "200px"
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
    },
    title: {
        fontSize: 14,
        textAlign: "center"
    },
    pos: {
        marginBottom: 12,
        marginTop: 12,
        textAlign: "center"
    },
    button: {
        width: 200,
        marginRight: "auto",
        marginLeft: "auto"
    },
    google: {
        marginTop: "20px",
        width: "200px",
        height: "35px",
        marginRight: "auto",
        marginLeft: "auto",
        borderRadius: "4px",
        background: "#db3236",
        color: "white",
        border: "0px transparent",
        textAlign: "center",
        cursor: "pointer"
    },
    fb: {
        width: "200px",
        height: "35px",
        borderRadius: "4px",
        background: "#3b5998",
        color: "white",
        border: "0px transparent",
        textAlign: "center",
        margin: "3px",
        marginRight: "auto",
        marginLeft: "auto",
        display: "inline-block"
    }
});

class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            errorText: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleErr = this.handleErr.bind(this);
    }
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            // if isauth true which means user is loged in - redirect
            this.props.history.push("/dashboard");
        }
    }

    validateForm() {
        var re = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
        return (
            re.test(String(this.state.email).toLowerCase()) &&
      this.state.password != ""
        );
    }

    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("http://localhost:5003/users/reset/" + this.props.id, {
                password: this.state.password
            })
            .then(response => {
                this.props.alert.show("Password successfully changed");
                this.props.history.push("/login");
            })
            .catch(err => {
                this.handleErr();
            });
    }
    handleErr() {
        this.setState({
            errorText: "Password reset token is invalid or expired"
        });
    }
  cleanEmailError = () => {
      this.setState({
          errorText: ""
      });
  };
  onLogoutClick(e) {
      e.preventDefault();
      this.props.logoutUser();
  }

  render() {
      const { classes } = this.props;

      return (
          <Card className={classes.card}>
              <CardContent>
                  <Typography className={classes.title} color="textSecondary">
            Reset password?
                  </Typography>
                  <form className={classes.container} noValidate autoComplete="off">
                      <FormControl className={classes.textField}>
                          <InputLabel>Password</InputLabel>
                          <Input
                              id="password"
                              value={this.state.password}
                              onChange={this.handleChange}
                              onClick={this.cleanEmailError}
                              type="password"
                          />
                          <FormHelperText error id="login-helper-text">
                              {this.state.errorText}
                          </FormHelperText>
                      </FormControl>
                      <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          onClick={this.handleSubmit}
                          className={classes.button}
                      >
              Reset
                      </Button>
                  </form>
                  <Typography className={classes.pos} color="textSecondary">
            don't have account yet?{" "}
                      <b>
                          <Link to="/register">Register</Link>
                      </b>
                  </Typography>
              </CardContent>
              <CardActions />
          </Card>
      );
  }
}

Reset.propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {}
)(withAlert(withStyles(styles)(Reset)));
