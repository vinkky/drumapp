import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { setCurrent } from '../../../actions/authActions';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import GoogleLogin from "react-google-login";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FacebookLogin from "react-facebook-login"
import { withAlert } from 'react-alert'
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    alignTtems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center'
  },
  textField: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  card: {
    width: 400,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '200px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    textAlign: 'center'
  },
  pos: {
    marginBottom: 12,
    marginTop: 12,
    textAlign: 'center'
  },
  button: {
    width: 200,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  google: {
    marginTop: '20px',
    width: '200px',
    height: '35px',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: '4px',
    background: '#db3236',
    color: 'white',
    border: '0px transparent',
    textAlign: 'center',
    cursor: 'pointer'
  },
  fb: {
    width: '200px',
    height: '35px',
    borderRadius: '4px',
    background: '#3b5998',
    color: 'white',
    border: '0px transparent',
    textAlign: 'center',
    margin: '3px',
    marginRight: 'auto',
    marginLeft: 'auto',
    display: 'inline-block'
  }

});

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      newUser: null,
      formErrors: { email: "", password: "", confirmPassword: "" },
      emailValid: false,
      passwordValid: false,
      passwordConfirm: false,
      formValid: false,
      errorText: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let passwordConfirm = this.state.passwordConfirm;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "Email is invalid";
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "Password is too short";
        if (this.state.confirmPassword.length > 0) {
          passwordConfirm = value === this.state.confirmPassword
          fieldValidationErrors.passwordConfirm = passwordConfirm
            ? ""
            : "Password does not match";
        }
        break;
      case "confirmPassword":
        passwordConfirm = value === this.state.password;
        fieldValidationErrors.passwordConfirm = passwordConfirm
          ? ""
          : "Password does not match";
      default:
        break;
    }

    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
        passwordConfirm: passwordConfirm
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.passwordValid &&
        this.state.passwordConfirm
    });
  }

  handleChange(e) {
    const name = e.target.id;
    const value = e.target.value;

    this.setState(
      {
        [name]: value
      },
      () => {
        this.validateField(name, value);
      }
    );
  }
  cleanEmailError = () => {
    this.setState({
      errorText: ""
    })
  }
  handleSubmit(e) {
    e.preventDefault();
    axios
      .post("http://localhost:5000/users/signup", {
        email: this.state.email,
        name: this.state.name,
        password: this.state.password

      })
      .then(response => {
        console.log(response.data)
        this.props.history.push('/login')
        this.props.alert.show('Registered successfully!')
        //this.props.setCurrent(response.data.token);
      })
      .catch(err => {
        this.handleErr();
      });

    this.props.history.push('/')
  }
  handleErr = () => {
    this.setState({
      errorText: 'Email is already taken'
    })
  }

  responseFacebook = response => {
    const access_token = response.accessToken;
    axios
      .post("http://localhost:5000/users/oauth/facebook", {
        access_token
      })
      .then(response => {
        this.props.setCurrent(response.data.token);
        this.props.history.push('/dashboard')
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  responseGoogle = response => {
    const access_token = response.Zi.access_token;
    axios
      .post("http://localhost:5000/users/oauth/google", {
        access_token
      })
      .then(response => {
        this.props.setCurrent(response.data.token);
        this.props.history.push('/dashboard')
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Register today
        </Typography>
          <form className={classes.container} noValidate autoComplete="off">
            <FormControl className={classes.textField}>
              <InputLabel>Name</InputLabel>
              <Input
                id="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
              <FormHelperText error id="name-helper-text">
                {this.state.formErrors.name}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.textField}>
              <InputLabel>Email</InputLabel>
              <Input
                id="email"
                value={this.state.email}
                onChange={this.handleChange}
                onClick={this.cleanEmailError}
              />
              <FormHelperText error id="name-helper-text">
                {this.state.formErrors.email}
                {this.state.errorText}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.textField}>
              <InputLabel>Password</InputLabel>
              <Input
                id="password"
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
              />
              <FormHelperText error id="name-helper-text">
                {this.state.formErrors.password}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.textField}>
              <InputLabel>Confirm password</InputLabel>
              <Input
                id="confirmPassword"
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                type="password"
              />
              <FormHelperText error id="name-helper-text">
                {this.state.formErrors.passwordConfirm}
              </FormHelperText>
            </FormControl>
            <Button variant="contained" color="primary" disabled={!this.state.formValid}
              type="submit"
              onClick={this.handleSubmit} className={classes.button}>
              Register
            </Button>
            <GoogleLogin
              className={classes.google}
              clientId="890644813294-bvuq6cf7lsilohneqvov28oi60sfdmig.apps.googleusercontent.com"
              onSuccess={response => this.responseGoogle(response)}
              onFailure={response => this.responseGoogle(response)}
            >
              <i class="fab fa-google-plus-g"></i>
              <span>&nbsp;&nbsp;Sign In with Google</span>
            </GoogleLogin>
            <FacebookLogin
              cssClass={classes.fb}
              autoLoad={false}
              appId="485850475180066"
              autoLoad={false}
              fields="name,email,picture"
              //onClick={componentClicked}
              callback={response => this.responseFacebook(response)}
              icon={<i className="fab fa-facebook-f" style={{ marginLeft: '5px' }}>
              </i>}
              textButton="&nbsp;&nbsp;Sign In with Facebook"
            />
          </form>
          <Typography className={classes.pos} color="textSecondary">
            already have an account? <b><Link to='/login'>Login</Link></b>
          </Typography>
        </CardContent>
        <CardActions>

        </CardActions>
      </Card>

    )
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { setCurrent })(withAlert(withStyles(styles)(Register)));