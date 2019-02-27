/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import * as trackControls from "./Controls/Trackcontrols";
import * as loopControls  from "./Controls/SequenceControls";
import CustomButton from "./Components/CustomButton";
import SequenceBar from "./Components/SequenceBar";
import TracksComponent from "./Components/TracksComponent";
import OneShotComponent from "./Components/OneshotComponent";
import NoiseComponent from "./Components/NoiseComponent";
import EffectsComponent from "./Components/EffectsComponent";
import { CircleSlider } from "react-circle-slider";
import Slider, { Range } from "rc-slider";
import MusicBox from "./DrumMachine";
import Tables from "../DashBoard/Tables";

import Tone from "tone";

import "rc-slider/assets/index.css";
import "./DrumMachine.css";



// setTimeout(() => {
//   audioScene();
// }, 0);

// function audioScene() {
//   ReactDOM.render(
//     <MusicBox  />,
//     document.getElementById("root")
//   );
// }

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      bpm: 120,
      setState: 0,
      selectedTrack: 0, 
      currentBeat: -1,
      locked: false,
      patternMode: false,
      pattern: trackControls.initBeats(16),
      notes: ["2n", "4n", "8n", "16n"],
      masterVolume: 0,
      currentBar: 0,
      switchLengths: [16, 32],
      selectedLength: 0,
    };

    // Init sequence
    loopControls.updateBPM(this.state.bpm);

    // Change maser volume
    Tone.Master.volume.value= this.state.masterVolume;
     
    // Recording functionality
    this.audio = React.createRef();
    this.myRef = React.createRef();
    const actx  = Tone.context;
    const dest  = actx.createMediaStreamDestination();
    this.recorder = new MediaRecorder(dest.stream);
    Tone.Master.connect(dest);
    const chunks = [];
    this.recorder.ondataavailable = evt => chunks.push(evt.data);
    this.recorder.onstop = evt => {
      let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      this.audio.current.src = URL.createObjectURL(blob);
      this.myRef.current.href =  URL.createObjectURL(blob);
      this.setState({stop: this.state.stop + 1});
    };
  }

      

  render() {
    return (
      <div className="wrapper">
        <div className="flex-grid-thirds">
          <div className="col"> <NoiseComponent/></div>
          <div className="col"><EffectsComponent/></div>
          <div className="col">            <div className="AudioPlayer">
            <audio ref={this.audio} controls controlsList="nodownload" autostart="0"></audio>
          </div>
          <a className="DownloadBtn" ref={this.myRef} href="" download>download</a></div>
        </div>
        <div className="row">
          <div className="main">
            <div className="tracks">
              <OneShotComponent/>
              <MusicBox/>
                    
            </div>
          </div>
          <div className="side">
            <CustomButton 
              source={this.recorder}
              click={"Record"}
              unclick={"Stop"}/>
            <Slider
              style={{height:"60px"}}
              min={-50}
              defaultValue={0}
              max={12} 
              step={1}
              vertical={true}
              onChange={value => this.changeMasterVolume(parseFloat(value))}
            />
            <button
              style={this.state.patternMode ?{backgroundColor: "#283845"} : {backgroundColor: "#B8B08D"}}
              onClick={this.updatePatternMode} 
            >
                    PT MODE
            </button>
            {this.state.switchLengths.map((item, i) => {
              return (
                <button 
                  style={i == this.state.selectedLength ? {backgroundColor: "#283845"} : {backgroundColor: "#747474"}}
                  key={i}
                  onClick={() => this.changeSwitchLength(i)}
                >
                  {item}
                </button>
              );
            })
            }
            <button onClick={this.addTrack}>
                      Add sound
            </button>
            <CircleSlider 
              className={"CircleKnob"}
              circleColor={"#283845"}
              progressColor={"#B8B08D"}
              knobColor={"#B8B08D"}
              value={this.state.bpm} min={30} max={240} size={50} knobRadius={5}  circleWidth={2}  progressWidth={4} 
              onChange={value => this.updateBPM(parseFloat(value))} />
            <h1>{this.state.bpm}</h1>
          </div>
        </div>
        <Tables/>
      </div>

    );
  }
}





export default DrumMachine;
