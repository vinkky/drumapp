/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import * as trackControls from "./Controls/Trackcontrols";
import * as loopControls  from "./Controls/SequenceControls";
import * as RecodingControls from "./Controls/RecodingControls";
import CustomButton from "./Components/CustomButton";
import SequenceBar from "./Components/SequenceBar";
import SynthComponent from "./Components/SynthComponent";
import TracksComponent from "./Components/TracksComponent";
import BassComponent from "./Components/BassComponent";
import OneShotComponent from "./Components/OneshotComponent";
import NoiseComponent from "./Components/NoiseComponent";
import EffectsComponent from "./Components/EffectsComponent";
import { CircleSlider } from "react-circle-slider";
import Slider, { Range } from "rc-slider";


import Tone from "tone";

import "rc-slider/assets/index.css";
import "./DrumMachine.css";

setTimeout(() => {
  audioScene();
}, 0);

function audioScene() {
  ReactDOM.render(
    <MusicBox  />,
    document.getElementById("root")
  );
}

class MusicBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      bpm: 120,
      tracks: [
        {id: 1,  name: "kick-808", vol: 1, muted: false, note: "4n", beats: trackControls.initBeats(16), currPattern: 0, patterns : trackControls.initPatterns(4), switchMode: false, switchPatterns:trackControls.initSwitches(8)},
        {id: 2,  name: "clap-808", vol: 1, muted: false, note: "8n", beats: trackControls.initBeats(16), currPattern: 0, patterns : trackControls.initPatterns(4), switchMode: false, switchPatterns:trackControls.initSwitches(8)},
        {id: 3,  name: "snare-808", vol: 1, muted: false, note: "8n", beats: trackControls.initBeats(16), currPattern: 0, patterns : trackControls.initPatterns(4), switchMode: false, switchPatterns:trackControls.initSwitches(8)},
        {id: 4,  name: "hihat-808", vol: 1, muted: false, note: "16n", beats: trackControls.initBeats(16), currPattern: 0, patterns : trackControls.initPatterns(4), switchMode: false, switchPatterns:trackControls.initSwitches(8)},
        {id: 5,  name: "tom-808", vol: 1, muted: false, note: "8n", beats: trackControls.initBeats(16), currPattern: 0, patterns : trackControls.initPatterns(4), switchMode: false, switchPatterns:trackControls.initSwitches(8)},
      ],
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
      i: 0
    };

    // Init sequence
    this.loop = loopControls.create(this.state.tracks, this.updateCurrentBeat);
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
    };
  }

        // Pattern functionality
        updatePatternMode = () => {
          this.setState({patternMode: !this.state.patternMode});
        };
        togglePaternBeat = (beat) => {
          const {pattern} = this.state;
          this.setState({
            pattern: pattern .map((v, i) => i !== beat ? v : !v)
          });
        };
        addTrackPatern = (id, slotid) => {
          const {tracks, pattern} = this.state;
          this.setState({
            tracks: trackControls.addTrackPatern(tracks, id, slotid, pattern)
          });
        };
        changeTrackPattern = (id, patternID) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.changeTrackPattern(tracks, id, patternID));
        };
        toggleSwitchPattern = (id, i) => {
          const {tracks} = this.state;
          this.setState({tracks: trackControls.toggleSwitchPattern(tracks, id, i)});
          console.log("toggle switch", this.state.tracks);
        }
        switchPatternMode = (id) => {
          const {tracks} = this.state;
          this.setState({tracks: trackControls.switchPatternMode(tracks, id)});
          console.log(this.state.tracks);
        }
        switchTrackPattern = () => {
          const {tracks, currentBar} = this.state;
          tracks.forEach(({id, switchMode, switchPatterns }) => {
            let patternID = switchPatterns[currentBar];
            let index = (currentBar - 1 + 8) % 8;
            if (switchMode && switchPatterns[index]!==switchPatterns[currentBar]) {
              this.changeTrackPattern(id, patternID);
              console.log("ivyko");
            }
          });
        }
        changeSwitchLength = (id) => {
          this.setState({selectedLength: id});
        }
        // Sequence functionality
        updateCurrentBeat = (beat) => {
          const {i, currentBar, currentBeat, switchLengths, selectedLength} = this.state;
          this.setState({currentBeat: beat});
          if(currentBeat % 16 == 0){
            this.setState({currentBar: (currentBar + 1) % 8});
            this.switchTrackPattern();
            console.log(currentBar);
          }
          // if(this.state.currentBar == 8){
          //   this.setState({currentBar: 0});
          // }
        };
        changeMasterVolume = (volume) => {
          Tone.Master.volume.value = volume;
          return this.setState({masterVolume : volume});
        }
        updateBPM = (newBpm) => {
          loopControls.updateBPM(newBpm);
          this.setState({bpm: newBpm});
        };
        updateTracks = (newTracks) => {
          this.loop = loopControls.update(this.loop, newTracks, this.updateCurrentBeat);
          this.setState({tracks: newTracks});
        };
        toggleTrackBeat = (id, beat) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.toggleTrackBeat(tracks, id, beat));
        };
        addTrack = () => {
          const {tracks} = this.state;
          if(tracks.length <= 8) {
            this.updateTracks(trackControls.addTrack(tracks));
          }
        };
        deleteTrack = (id) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.deleteTracks(tracks, id));
        };
        muteTrack = (id) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.muteTrack(tracks, id));
        };
        setTrackVolume = (id, vol) => {
          if (!this.state.locked) {
            this.setState({locked: true});
            setTimeout(this.unlock, 301);
            const {tracks} = this.state;
            this.updateTracks(trackControls.setTrackVolume(tracks, id, vol));
          }
        };
        unlock = () => {
          this.setState({locked: false});
        }
        updateTrackSample = (id, sample) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.updateTrackSample(tracks, id, sample));
        };
        updateTrackNote = (id, note) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.updateTrackNote(tracks, id, note));
        };
        clearTrack = (id) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.clearTrack(tracks, id));
        };
        updateTrackSample = (id, sample) => {
          const {tracks} = this.state;
          this.updateTracks(trackControls.updateTrackSample(tracks, id, sample));
        };
        selectTrack = (id) => {
          this.setState({selectedTrack: id});
        };

        render() {
          return (

           <div className="wrapper">
           <div className="flex-grid-thirds">
             <div className="col">This little piggy went to market.</div>
             <div className="col">This little piggy stayed home.</div>
             <div className="col">This little piggy had roast beef.</div>
           </div>
           <div className="row">
           
             <div className="main">
               <div className="tracks">s</div>
               <div className="sequence">s</div>
             </div>
               <div className="side">
               dasdasdas
             </div>
           </div>
           </div>










            <div className={"Container"}>
              <CustomButton 
                source={this.loop}
                click={"Play"}
                unclick={"Stop"}/>
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
              <OneShotComponent/>
              <TracksComponent
                index={this.state.currentBeat}
                currentBar={this.state.currentBar}
                tracks={this.state.tracks}
                notes={this.state.notes}
                toggleTrackBeat={this.toggleTrackBeat}
                deleteTrack={this.deleteTrack}
                muteTrack={this.muteTrack}
                addTrackPatern={this.addTrackPatern}
                changeTrackPattern={this.changeTrackPattern}
                clearTrack={this.clearTrack}
                setTrackVolume={this.setTrackVolume}
                updateTrackSample={this.updateTrackSample}
                updateTrackNote={this.updateTrackNote}
                toggleSwitchPattern={this.toggleSwitchPattern}
                switchPatternMode={this.switchPatternMode}
                patternMode={this.state.patternMode}
                selectedTrack={this.state.selectedTrack}
                selectTrack={this.selectTrack}/>
                
              <SequenceBar
                selectedTrack={this.state.selectedTrack}
                index={this.state.currentBeat}
                patternMode={this.state.patternMode}
                pattern={this.state.pattern}
                togglePaternBeat={this.togglePaternBeat}
                tracks={this.state.tracks}
                toggleTrackBeat={this.toggleTrackBeat}
              />
              <NoiseComponent/>
              <EffectsComponent/>
              <div className="AudioPlayer">
                <audio ref={this.audio} controls controlsList="nodownload" autostart="0"></audio>
              </div>
              <a className="DownloadBtn" ref={this.myRef} href="" download>download</a>
            </div>
          );
        }
}





export default MusicBox;
