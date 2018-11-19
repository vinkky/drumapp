/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import * as trackControls from "./Controls/Trackcontrols";
import * as loopControls  from "./Controls/SequenceControls";
import PlayButton from "./Components/PlayButton";
import SequenceBar from "./Components/SequenceBar";
import SynthComponent from "./Components/SynthComponent";
import TracksComponent from "./Components/TracksComponent";
import { CircleSlider } from "react-circle-slider";


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
                {id: 1,  name: "kick-808", vol: 1, muted: false, note: "4n", beats: initBeats(16), currPattern: 0, patterns : initPatterns(4)},
                {id: 2,  name: "clap-808", vol: 1, muted: false, note: "8n", beats: initBeats(16), currPattern: 0, patterns : initPatterns(4)},
                {id: 3,  name: "snare-808", vol: 1, muted: false, note: "8n", beats: initBeats(16), currPattern: 0, patterns : initPatterns(4)},
                {id: 4,  name: "hihat-808", vol: 1, muted: false, note: "16n", beats: initBeats(16), currPattern: 0, patterns : initPatterns(4)},
                {id: 5,  name: "tom-808", vol: 1, muted: false, note: "8n", beats: initBeats(16), currPattern: 0, patterns : initPatterns(4)},
            ],
            selectedTrack: 0,
            currentBeat: -1,
            locked: false,
            patternMode: false,
            pattern: initBeats(16),
            notes: ["2n", "4n", "8n", "16n"]

        };
        function initBeats(n) {
            return new Array(n).fill(false);
        }
        function initPatterns(n) {
            return new Array(n).fill(Array(16).fill(false));
        }
        this.loop = loopControls.create(this.state.tracks, this.updateCurrentBeat);
        loopControls.updateBPM(this.state.bpm);
        
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
        // Sequence functionality
        updateCurrentBeat = (beat) => {
            this.setState({currentBeat: beat});
        };
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
                <div className={"Container"}>
                    <TracksComponent
                        index={this.state.currentBeat}
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
                    <SynthComponent/>
                    <PlayButton 
                        loop={this.loop} />
                    <button
                        style={this.state.patternMode ?{backgroundColor: "#283845"} : {backgroundColor: "#B8B08D"}}
                        onClick={this.updatePatternMode} 
                    >
                    PT MODE
                    </button>
                    <button
                        onClick={this.addTrack} 
                    >
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
            );
        }
}





export default MusicBox;
