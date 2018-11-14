import React from "react";

class PlayButton extends React.Component {
  state = {
      isPlaying: false
  };

  onClick = () => {
      const isPlaying = !this.state.isPlaying;
      this.setState({ isPlaying });
      if (isPlaying) {
          this.props.loop.start();
      } else {
          this.props.loop.stop();
      }
  };

  render() {
      return (
          <button style={{width: "50px", height: "50px", borderRadius: "4px", backgroundColor: "#F29559", border: "none"}} type="button" onClick={this.onClick}>
              {this.state.isPlaying ? "Stop" : "Play"}
          </button>
      );
  }
}

export default PlayButton;