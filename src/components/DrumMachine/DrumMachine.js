/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom";
import * as trackControls from "./Controls/Trackcontrols";
import * as loopControls  from "./Controls/SequenceControls";
import PlayButton from "./Components/PlayButton";
import SequenceBar from "./Components/SequenceBar";
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
                {id: 1,  name: "kick-808", vol: 1, muted: false, note: "4n", beats: initBeats(16) },
                {id: 2,  name: "clap-808", vol: 1, muted: false, note: "8n", beats: initBeats(16) },
                {id: 3,  name: "snare-808", vol: 1, muted: false, note: "8n", beats: initBeats(16) },
                {id: 4,  name: "hihat-808", vol: 1, muted: false, note: "16n", beats: initBeats(16) },
                {id: 5,  name: "tom-808", vol: 1, muted: false, note: "8n", beats: initBeats(16) },
            ],
            currentBeat: -1,
            locked: false

        };
        function initBeats(n) {
            return new Array(n).fill(false);
        }
        this.loop = loopControls.create(this.state.tracks, this.updateCurrentBeat);
        loopControls.updateBPM(this.state.bpm);
        
    }
    
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
        clearTrack = (id) => {
            const {tracks} = this.state;
            this.updateTracks(trackControls.clearTrack(tracks, id));
        };

        render() {
            return (
                <div className={"Container"}>
                    <TracksComponent
                        index={this.state.currentBeat}
                        tracks={this.state.tracks}
                        toggleTrackBeat={this.toggleTrackBeat}
                        muteTrack={this.muteTrack}
                        clearTrack={this.clearTrack}
                        setTrackVolume={this.setTrackVolume}
                        updateTrackSample={this.updateTrackSample}
                        updateBPM={this.updateBPM}/>
                    <SequenceBar
                        index={this.state.currentBeat}
                        tracks={this.state.tracks}
                        toggleTrackBeat={this.toggleTrackBeat}
                    />
                    <PlayButton loop={this.loop} />
                    <CircleSlider 
                        className={"CircleKnob"}
                        circleColor={"#283845"}
                        progressColor={"#B8B08D"}
                        knobColor={"#B8B08D"}
                        value={this.state.bpm} min={30} max={240} size={50} knobRadius={5}  circleWidth={2}  progressWidth={4} onChange={value => this.updateBPM(parseFloat(value))} />
                    <h1>{this.state.bpm}</h1>
                    
                </div>
            );
        }
}





export default MusicBox;
