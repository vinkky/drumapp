import React from "react";
import ReactDOM from "react-dom";
import Tone from "tone";
import * as trackControls from "./Controls/Trackcontrols";
import * as loopControls  from "./Controls/SequenceControls";
import "./DrumMachine.css";

import Checkbox from "@material-ui/core/Checkbox";
import ClearIcon from "@material-ui/icons/DeleteTwoTone";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

import samples from "../../samples";

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
    loop
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            tracks: [
                {id: 1,  name: "kick-808", vol: -60, muted: false, note: "4n", beats: initBeats(16) },
                {id: 2,  name: "clap-808", vol: 1, muted: false, note: "8n", beats: initBeats(16) },
                {id: 3,  name: "snare-808", vol: 1, muted: false, note: "8n", beats: initBeats(16) },
                {id: 4,  name: "hihat-808", vol: 1, muted: false, note: "16n", beats: initBeats(16) },
                {id: 5,  name: "tom-808", vol: 1, muted: false, note: "8n", beats: initBeats(16) },
            ],
            currentBeat: -1,
            velocities: [
            // will be some volocity values .05 0.8 etc
            ]
        };
        function initBeats(n) {
            return new Array(n).fill(false);
        }
        this.loop = loopControls.create(this.state.tracks, this.updateCurrentBeat);
        
    }
    
        updateCurrentBeat = (beat) => {
            this.setState({currentBeat: beat});
        };
        updateTracks = (newTracks) => {
            this.loop = loopControls.update(this.loop, newTracks, this.updateCurrentBeat);
            this.setState({tracks: newTracks});
        };
        toggleTrackBeat = (id, beat) => {
            const {tracks} = this.state;
            this.updateTracks(trackControls.toggleTrackBeat(tracks, id, beat));
        };
        muteTrack = (id) => {
            const {tracks} = this.state;
            this.updateTracks(trackControls.muteTrack(tracks, id));
        };
        setTrackVolume = (id, vol) => {
            const {tracks} = this.state;
            this.updateTracks(trackControls.setTrackVolume(tracks, id, vol));
        };
        updateTrackSample = (id, sample) => {
            const {tracks} = this.state;
            this.updateTracks(trackControls.updateTrackSample(tracks, id, sample));
        };
        clearTrack = (id) => {
            const {tracks} = this.state;
            this.updateTracks(trackControls.clearTrack(tracks, id));
        };

        render() {
            return (
                <div>
                    <ScorePlot
                        width={this.props.data[0].length}
                        height={this.props.data.length}
                        data={this.props.data}
                        index={this.state.currentBeat}
                        tracks={this.state.tracks}
                        toggleTrackBeat={this.toggleTrackBeat}
                        muteTrack={this.muteTrack}
                        clearTrack={this.clearTrack}
                        setTrackVolume={this.setTrackVolume}
                        updateTrackSample={this.updateTrackSample}
                    />
                    <PlayButton loop={this.loop} />
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
              <tbody>{
                  this.props.tracks.map((track, i) => {
                      return (
                          <tr key={i} className="track">

                              { i === this.state.instrument ? 
                                  track.beats.map((v, beat) => {
                                      const beatClass = v ? "active" : beat === this.props.index ? "current" : "";
                                      return (
                                          <td key={beat} className={`beat ${beatClass}`}>
                                              <a href="" onClick={(event) => {
                                                  event.preventDefault();
                                                  this.props.toggleTrackBeat(track.id, beat);
                                              }} />
                                          </td>
                                      );
                                  }) : null
                              }
                          </tr>
                      );
                  })
              }</tbody>
              <thead>
                  {
                      this.props.tracks.map((track, i) => {
                          return (
                              <tr key={i} className="track">
                                  <th>
                                      <SampleSelector id={track.id} current={track.name} onChange={this.props.updateTrackSample} />
                                  </th>
                                  <td className="mute">
                                      <Checkbox
                                          checked={!track.muted}
                                          onChange={() => this.props.muteTrack(track.id)}
                                      />
                                  </td>
                                  <td>
                                      {track.beats.some(v => v) ?
                                          <a href="" title="Clear track" onClick={event => {
                                              event.preventDefault();
                                              this.props.clearTrack(track.id);
                                          }}><ClearIcon name="delete"/></a> :
                                          <ClearIcon className="disabled-icon" name="delete"/>}
                                  </td>
                                  <td>
                                      <div>
                                          <Slider
                                              style={{width: "100px"}}
                                              min={-62}
                                              defaultValue={1}
                                              max={12} 
                                              onChange={value => this.props.setTrackVolume(track.id, parseFloat(value))}
                                          />
                                      </div>
                                  </td>
                              </tr>
                          );
                      })
                  }
                  <tr>
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
class SampleSelector extends React.Component {
    state = {
        open: false
    };
    constructor(props) {
        super(props);
        this.state = {open: false};
    }
  
    open = (event) => {
        event.preventDefault();
        this.setState({open: true});
    };
  
    close = () => {
        this.setState({open: false});
    };
  
    onChange = (event) => {
        const {id, onChange} = this.props;
        onChange(id, event.target.value);
        this.close();
    };
  
    render() {
        const {current} = this.props;
        const {open} = this.state;
        if (open) {
            return (
                <select autoFocus value={current} onChange={this.onChange} onBlur={this.close}>{
                    samples.map((sample, i) => {
                        return <option key={i}>{sample}</option>;
                    })
                }</select>
            );
        } else {
            return <a href="" onClick={this.open}>{current}</a>;
        }
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
