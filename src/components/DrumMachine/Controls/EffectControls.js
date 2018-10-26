import React, {  } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import "./VolumeControls.css";

const styles = {
    button: {
        marginTop: "5px",
        margin: "0px auto",
        width: "20px",
        height: "20px",
        color: "#f15025",
        background: "rgb(45, 45, 109)",
        fontSize: "5px",
        padding: "0",
        border: "none"
    },
    center: {
        margin: "0px auto"
    }
};
class EffectController extends React.Component {

  state = {
      value: 0
  };

  handleChange = value => {
      this.setState({ value });
  };

  handleChangeRange = event => {
      this.setState({
          value: event.target.valueAsNumber
      });
  };

  render() {
      return (
          <div
              style={{
                  alignItems: "center"
              }}
          >
              <p>asdas</p>
          </div>
      );
  }
}
EffectController.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EffectController);
