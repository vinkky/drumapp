import React from "react";
import ReactDOM from "react-dom";
import Tone from "tone";

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
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      tracks: [
        { name: "kick-808", volume: 0, muted: false, note: "4n" },
        { name: "clap-808", volume: 0, muted: false, note: "8n" },
        { name: "snare-808", volume: 0, muted: false, note: "8n" },
        { name: "hihat-808", volume: 0, muted: false, note: "16n" },
        { name: "tom-808", volume: 0, muted: false, note: "8n" },
      ],
      velocities: [
        1,
        0.65,
        0.75,
        0.85,
        1,
        0.65,
        0.75,
        0.85,
        1,
        0.65,
        0.75,
        0.85,
        1,
        0.65,
        0.75,
        0.85
      ]
    };

    // create = (tracks, beatNotifier) => {
    //   const loop = new Tone.Sequence(
    //     loopProcessor(tracks, beatNotifier),
    //     new Array(16).fill(0).map((_, i) => i),
    //     "16n"
    //   );
    // };

    // loopProcessor = (tracks, beatNotifier) => {
    //   // XXX this may be now totally unnecessary as we can infer the sample url
    //   // directly from the name
    //   const urls = tracks.reduce((acc, {name}) => {
    //     return {...acc, [name]: `http://localhost:3000/src/sounds/${name}.[wav|wav]`};
    //   }, {});

    //   const keys = new Tone.Players({urls},       {
    //     fadeOut: "64n"
    //   }).toMaster();

    //   return (time, index) => {
    //     beatNotifier(index);
    //     tracks.forEach(({name, vol, muted, beats}) => {
    //       if (beats[index]) {
    //         try {
    //           keys.start(name, time, 0, "1n", 0, muted ? 0 : velocities[index] * vol);
    //         } catch(e) {
    //         }
    //       }
    //     });
    //   };
    // }
    const urls = this.state.tracks.reduce((acc, { name }) => {
      return {
        ...acc,
        [name]: `http://localhost:3000/src/sounds/${name}.[wav|wav]`
      };
    }, {});
    console.log(urls);
    const keys = new Tone.Players(
      urls,

      {
        fadeOut: "64n"
      }
    ).toMaster();

    this.loop = new Tone.Sequence(
      (time, x) => {
        for (let y = 0; y < this.state.tracks.length; y++) {
          if (this.props.data[y][x]) {
            try {
              keys
                .get(this.state.tracks[y].name)
                .start(time, 0, this.state.tracks[y].note, 0);
              keys
                .get(this.state.tracks[y].name).volume.value = this.state
                  .tracks[y].muted
                  ? -Infinity
                  : this.state.tracks[y].volume;
            } catch (e) {}
          }
        }
        this.setState({ index: x });
      },
      [...new Array(16)].map((_, i) => i),
      "16n"
    );


    var noise = new Tone.Noise("white").start();
    noise.volume.value = -30;

    //make an autofilter to shape the noise
    var autoFilter = new Tone.AutoFilter({
      "frequency" : "8m",
      "min" : -400,
      "max" : -200
    }).connect(Tone.Master);
    
    //connect the noise
    noise.connect(autoFilter);
    //start the autofilter LFO

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
          tracks={this.state.tracks}
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
