/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withAlert } from 'react-alert';
import { ReCaptcha } from 'react-recaptcha-google';
import InputLabel from '@material-ui/core/InputLabel';

const styles = (theme) => ({
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
		marginRight: 'auto',
		marginLeft: 'auto',
		marginTop: '200px'
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
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

class Forgot extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			name: '',
			email: '',
			password: '',
			errorText: '',
			captcha: ''
		};
		this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
		this.verifyCallback = this.verifyCallback.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleErr = this.handleErr.bind(this);
	}
	componentDidMount() {
		if (this.captchaDemo) {
			this.captchaDemo.reset();
		}
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/drum');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			// if isauth true which means user is loged in - redirect
			this.props.history.push('/drum');
		}
	}

	validateForm() {
		var re = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
		return re.test(String(this.state.email).toLowerCase()) && this.state.password != '';
	}
	onLoadRecaptcha() {
		if (this.captchaDemo) {
			this.captchaDemo.reset();
		}
	}
	verifyCallback(recaptchaToken) {
		// Here you will get the final recaptchaToken!!!
		this.setState({ captcha: recaptchaToken });
	}

	handleChange(e) {
		this.setState({
			[e.target.id]: e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		axios
			.post('http://localhost:5000/users/forgot', {
				email: this.state.email
			})
			.then((response) => {
				this.props.alert.show('Instructions has been sent. Check your email!');
			})
			.catch((err) => {
				this.handleErr(err.response.status);
			});
	}
	handleErr(errorCode) {
		switch (errorCode) {
			case 429:
				this.setState({
					errorText: 'Too many requests, try again in a 5 minutes'
				});
				break;
			case 400:
				this.setState({ errorText: "Email doesn't exist" });
				break;
			default:
				return true;
		}
	}
	cleanEmailError = () => {
		this.setState({
			errorText: ''
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
						Forgot password?
					</Typography>
					<form className={classes.container} noValidate autoComplete="off">
						<FormControl className={classes.textField}>
							<InputLabel>Email</InputLabel>
							<Input
								id="email"
								value={this.state.email}
								onClick={this.cleanEmailError}
								onChange={this.handleChange}
							/>
							<FormHelperText error id="name-helper-text">
								{this.state.errorText}
							</FormHelperText>
						</FormControl>
						<br />
						<ReCaptcha
							ref={(el) => {
								this.captchaDemo = el;
							}}
							size="normal"
							data-theme="dark"
							render="explicit"
							sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
							onloadCallback={this.onLoadRecaptcha}
							verifyCallback={this.verifyCallback}
						/>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							disabled={!this.state.captcha}
							onClick={this.handleSubmit}
							className={classes.button}
						>
							Forgot
						</Button>
					</form>
					<Typography className={classes.pos} color="textSecondary">
						don't have account yet?{' '}
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

Forgot.propTypes = {
	classes: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, {})(withAlert(withStyles(styles)(Forgot)));
