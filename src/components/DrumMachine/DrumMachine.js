import React from "react";
import ReactDOM from "react-dom";
import Tone from "tone";
import * as trackControls from "./Controls/Trackcontrols";
import {create}  from "./Controls/SequenceControls";
import "./DrumMachine.css";

const musicData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

    sequence
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            tracks: [
                {id: 1,  name: "kick-808", volume: 0, muted: false, note: "4n", beats: initBeats(16) },
                {id: 2,  name: "clap-808", volume: 0, muted: false, note: "8n", beats: initBeats(16) },
                {id: 3,  name: "snare-808", volume: 0, muted: false, note: "8n", beats: initBeats(16) },
                {id: 4,  name: "hihat-808", volume: 0, muted: false, note: "16n", beats: initBeats(16) },
                {id: 5,  name: "tom-808", volume: 0, muted: false, note: "8n", beats: initBeats(16) },
            ],
            currentBeat: -1,
            velocities: [
            // will be some volocity values .05 0.8 etc
            ]
        };
        function initBeats(n) {
            return new Array(n).fill(true);
        }

        // const urls = this.state.tracks.reduce((acc, { name }) => {
        //     return {
        //         ...acc,
        //         [name]: `http://localhost:3000/src/sounds/${name}.[wav|wav]`
        //     };
        // }, {});
        // const keys = new Tone.Players(
        //     urls,
        //     {
        //         fadeOut: "64n"
        //     }
        // ).toMaster();

        // this.loop = new Tone.Sequence(
        //     (time, x) => {
        //         for (let y = 0; y < this.state.tracks.length; y++) {
        //             if (this.props.data[y][x]) {
        //                 try {
        //                     keys
        //                         .get(this.state.tracks[y].name)
        //                         .start(time, 0, this.state.tracks[y].note, 0);
        //                     keys
        //                         .get(this.state.tracks[y].name).volume.value = this.state
        //                             .tracks[y].muted
        //                             ? -Infinity
        //                             : this.state.tracks[y].volume;
        //                 } catch (e) {}
        //             }
        //         }
        //         this.setState({ index: x });
        //     },
        //     [...new Array(16)].map((_, i) => i),
        //     "16n"
        // );

        // Tone.Transport.bpm.value = 130;
        // Tone.Transport.start();
        this.create = create.bind(this);
        this.sequence = create(this.state.tracks, this.updateCurrentBeat);
        
    }


        updateCurrentBeat = (beat) => {
            this.setState({currentBeat: beat});
        };

        render() {

            return (
                <div>
                    <ScorePlot
                        width={this.props.data[0].length}
                        height={this.props.data.length}
                        data={this.props.data}
                        index={this.state.index}
                        tracks={this.state.tracks}
                    />
                    <PlayButton sequence={this.sequence} />
                </div>
            );
        }
}

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
      case 53:
          this.setState({ instrument: 4 });
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
                                  <button>{this.props.tracks[y].name}</button>
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
          this.props.sequence.start();
      } else {
          this.props.sequence.stop();
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
