/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import "./Toolbar.css";

class Toolbar extends Component {
    onLogoutClick(e) {
        e.preventDefault();
        this.props.logoutUser();
    }
    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul>
                <li>
                    <a href="#" onClick={this.onLogoutClick.bind(this)}>
            Logout
                    </a>
                </li>
            </ul>
        );
        const guestLinks = (
            <ul>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        );
        return (
            <header className="toolbar">
                <nav className="toolbar__navigation">
                    <div className="toolbar__toggle-button">
                        <DrawerToggleButton click={this.props.drawerClickHandler} />
                    </div>
                    <div className="toolbar__logo">
                        <a href="/">THE LOGO</a>
                    </div>
                    <div className="spacer" />
                    <div className="toolbar_navigation-items">
                        <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
                    </div>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(Toolbar);
