import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Music from "@material-ui/icons/MusicNote";
import MusicOff from "@material-ui/icons/MusicOff";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/lab/Slider";

import "./VolumeControls.css";

const styles = {
  button: {
    marginTop: "5px",
    margin: "0px auto",
    width: "20px",
    height: "20px",
    color: '#f15025',
    background: "rgb(45, 45, 109)",
    fontSize: "5px",
    padding: "0",
    border: "none"
  },
  center: {
    margin: "0px auto"
  }
};
class VolumeController extends Component {
  state = {
    value: 50
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    console.log('renderina')
    return (
      <div className="container">
        <Slider
          classes={{ container: classes.center }}
          value={value}
          onChange={this.handleChange}
          vertical
        />
        <button className={classes.button}>M</button>
      </div>
    );
  }
}
VolumeController.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(VolumeController);
