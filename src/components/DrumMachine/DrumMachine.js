import React, { Component } from "react";
import ReactDOM from "react-dom";
import Tone from "tone";
import "./DrumMachine.css";

const musicData = [
  [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]
];

setTimeout(() => {
  audioScene();
}, 0);

function audioScene() {
  ReactDOM.render(
    <MusicBox data={musicData} />,
    document.getElementById("root")
  );
}

class MusicBox extends React.Component {
  state = {
    index: 0
  };

  constructor(props) {
    super(props);
    const keys = new Tone.Players(
      {
        A: "http://localhost:3000/src/sounds/Hihats.[wav|wav]",
        "C#": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/292951/Cs2.[mp3|ogg]",
        E: "http://localhost:3000/src/sounds/Clap.[wav|wav]",
        "F#": "http://localhost:3000/src/sounds/Kick2.[wav|wav]"
      },
      {
        fadeOut: "64n"
      }
    ).toMaster();
    const noteNames = "F# E C# A".split(" ");
    this.loop = new Tone.Sequence(
      (time, x) => {
        for (let y = 0; y < noteNames.length; y++) {
          if (this.props.data[y][x]) {
            keys.get(noteNames[y]).start(time, 0, "16n", 0);
          }
        }
        this.setState({ index: x });
      },
      [...new Array(16)].map((_, i) => i),
      "16n"
    );
    Tone.Transport.bpm.value = 130;

    Tone.Transport.start();
  }

  render() {
    return (
      <div>
        <ScorePlot
          width={this.props.data[0].length}
          height={this.props.data.length}
          data={this.props.data}
          index={this.state.index}
        />
        <PlayButton loop={this.loop} />
      </div>
    );
  }
}
const names = ["bass", "clap", "snare", "highhat"];
class ScorePlot extends React.Component {
  handleChange = (x, y) => {
    return e => {
      this.props.data[y][x] = +e.currentTarget.checked;
      this.forceUpdate();
    };
  };
  render() {
    return (
      <table>
        <tbody>
          {[...new Array(this.props.height)].map((_, y) => (
            <tr key={y}>
              <div>{names[y]}</div>
              {[...new Array(this.props.width)].map((_, x) => (
                <td key={x}>
                  <input
                    type="checkbox"
                    checked={this.props.data[y][x]}
                    onChange={this.handleChange(x, y)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {[...new Array(this.props.width)].map((_, x) => (
              <td key={x}>
                <input
                  type="checkbox"
                  checked={x === this.props.index}
                  disabled
                />
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    );
  }
}

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
      <button type="button" onClick={this.onClick}>
        {this.state.isPlaying ? "Stop" : "Play"}
      </button>
    );
  }
}
export default MusicBox;
