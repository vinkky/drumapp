import React, { Component } from "react";
import ReactDOM from "react-dom";
import Tone from "tone";

import "./DrumMachine.css";

const musicData = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

    var feedbackDelay = new Tone.PingPongDelay({
      delayTime: "8n",
      feedback: 0.6,
      wet: 0.5
    }).toMaster();
    var env = new Tone.Envelope({
      attack: 1.1,
      decay: 3.2,
      sustain: 1,
      release: 0.8
    });
    var gainNode = Tone.context.createGain();
    var distortion = new Tone.Distortion(0.2).toMaster();
    var filter = new Tone.Filter(200, "lowpass").toMaster();
    var reverb = new Tone.Reverb({
      decay: 6.5,
      preDelay: 0.5,
      wet: 1
    }).toMaster();
    var pitch = new Tone.PitchShift(20).toMaster();
    var panVol = new Tone.PanVol(0).toMaster();

    const keys = new Tone.Players(
      {
        A: "http://localhost:3000/src/sounds/Hihats.[wav|wav]",
        "C#":
          "https://s3-us-west-2.amazonaws.com/s.cdpn.io/292951/Cs2.[mp3|ogg]",
        E: "http://localhost:3000/src/sounds/Clap.[wav|wav]",
        "F#": "http://localhost:3000/src/sounds/Kick2.[wav|wav]"
      },

      {
        fadeOut: "64n"
      }
    ).toMaster();
    const noteNames = "F# E C# A".split(" ");
    for (let y = 0; y < noteNames.length; y++) {
      keys.get(noteNames[y]).connect(feedbackDelay);
      keys.get(noteNames[y]).connect(reverb);
      keys.get(noteNames[y]).connect(filter);
      keys.get(noteNames[y]).connect(panVol);
      keys.get(noteNames[y]).volume.value = -12;
      keys.get(noteNames[y]).connect(distortion);
      keys.get(noteNames[y]).connect(pitch);
    }
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
    //keys.get(noteNames[2]).chain(feedbackDelay, reverb, panVol, distortion, pitch);
    //keys.get(noteNames[2]).connect(feedbackDelay);
    env.connect(gainNode.gain);
    //keys.get(noteNames[2]).connect(reverb);
    //keys.get(noteNames[2]).connect(filter);
    //keys.get(noteNames[2]).connect(panVol);
    //keys.get(noteNames[2]).volume.value = -12;
    //keys.get(noteNames[2]).connect(distortion);
    //keys.get(noteNames[2]).connect(pitch);

    keys.get(noteNames[3]).mute = false;

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
        <Effects loop={this.loop} />
      </div>
    );
  }
}
const names = ["bass", "clap", "snare", "hihat"];

class ScorePlot extends React.Component {
  state = {
    instrument: 0
  };
  componentWillMount() {
    window.addEventListener("keydown", this.handleKeyboardInput.bind(this));
  }
  handleChange = (x, y) => {
    return e => {
      this.props.data[y][x] = +e.currentTarget.checked;
      this.forceUpdate();
    };
  };

  handleKeyboardInput = e => {
    const code = e.keyCode ? e.keyCode : e.which;
    switch (code) {
      case 49:
        this.setState({ instrument: 0 });
        break;
      case 50:
        this.setState({ instrument: 1 });
        break;
      case 51:
        this.setState({ instrument: 2 });
        break;
      case 52:
        this.setState({ instrument: 3 });
        break;
      default:
        return false;
    }
  };
  render() {
    return (
      <table>
        <tbody>
          {[...new Array(this.props.height)].map((_, y) => (
            <tr key={y}>
              {y === this.state.instrument
                ? [...new Array(this.props.width)].map((_, x) => (
                    <td key={x}>
                      <input
                        className={x % 4 === 0 ? "Valkata" : null}
                        type="checkbox"
                        checked={this.props.data[y][x]}
                        onChange={this.handleChange(x, y)}
                        onMouseMove={this.handleChange(x, y)}
                      />
                    </td>
                  ))
                : null}
              {y === this.state.instrument ? (
                <div>
                  <button>{names[y]}</button>
                </div>
              ) : null}
            </tr>
          ))}
        </tbody>
        <thead>
          <tr>
            <div />
            {[...new Array(this.props.width)].map((_, x) => (
              <td key={x} style={{}}>
                <input
                  type="checkbox"
                  checked={x === this.props.index}
                  disabled
                />
              </td>
            ))}
          </tr>
        </thead>
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
class Effects extends React.Component {
  state = {};

  render() {
    return <button>sss</button>;
  }
}
export default MusicBox;
