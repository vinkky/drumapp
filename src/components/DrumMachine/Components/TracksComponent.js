/* eslint-disable no-unused-vars */
import React from "react";
import Slider, { Range } from "rc-slider";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import VolumeOffIcon from "@material-ui/icons/volumeoff";
import VolumeOnIcon from "@material-ui/icons/volumeup";
import ClearIcon from "@material-ui/icons/clear";
import Selector from "./SampleSelector";
import samples from "../../../samples.json";
import "rc-slider/assets/index.css";

class TracksComponent extends React.Component {
    componentWillMount() {
        window.addEventListener("keydown", this.handleKeyboardInput.bind(this));
    }

handleKeyboardInput = e => {
    const code = e.keyCode ? e.keyCode : e.which;
    switch (code) {
    case 49:
        this.props.selectTrack(0);
        break;
    case 50:
        this.props.selectTrack(1);
        break;
    case 51:
        this.props.selectTrack(2);
        break;
    case 52:
        this.props.selectTrack(3);
        break;
    case 53:
        this.props.selectTrack(4);
        break;
    case 54:
        this.props.selectTrack(5);
        break;
    case 55:
        this.props.selectTrack(6);
        break;
    case 56:
        this.props.selectTrack(7);
        break;
    case 57:
        this.props.selectTrack(8);
        break;
    default:
        return false;
    }
};
render() {
    return (
        <div  className={"TrackComponent"}>
            {
                this.props.tracks.map((track, i) => {
                    return (
                        <div key={i} style={{backgroundColor: "#b9b9b9", float: "left", height:"200px", width: "80px", bottom: 0, textAlign: "center", border: "2px solid #454545", marginLeft: "4px"}} className="controls">
                            <div
                                style={{width: "10px", 
                                    height: "10px", 
                                    borderRadius: "50%",
                                    backgroundColor: i == this.props.selectedTrack ? "red" : "black" 
                                }}
                            />
                            <div>
                                <Slider
                                    style={{marginLeft: "33px", height:"60px"}}
                                    min={-62}
                                    defaultValue={1}
                                    max={12} 
                                    step={3.7}
                                    vertical={true}
                                    onChange={value => this.props.setTrackVolume(track.id, parseFloat(value))}
                                />
                            </div>
                            <div>
                                <div className="mute">
                                    {
                                        !track.muted ? 
                                            <VolumeOnIcon
                                                style={{color: "#283845", cursor: "pointer"}}
                                                onClick={() => this.props.muteTrack(track.id)}
                                            /> :
                                            <VolumeOffIcon
                                                style={{color: "#283845", cursor: "pointer"}}
                                                onClick={() => this.props.muteTrack(track.id)}
                                            />
                                    }
                                    
                                </div>
                                <div>
                                    {track.beats.some(v => v) ?
                                        <a href="" title="Clear track" onClick={event => {
                                            event.preventDefault();
                                            this.props.clearTrack(track.id);
                                        }}><ClearIcon name="delete"/></a> :
                                        <ClearIcon className="disabled-icon" name="delete"/>}
                                    <DeleteIcon 
                                        style={{cursor: "pointer"}}
                                        onClick={() => {this.props.deleteTrack(track.id);}}
                                        className="disabled-icon"/>
                                </div>
                            </div>
                            <div
                                style={{width: "10px", 
                                    height: "10px", 
                                    borderRadius: "50%",
                                    margin: "0px auto",
                                    backgroundColor: track.beats[this.props.index] == true ? "red" : "black" 
                                }}
                            />
                            <div>
                                {track.patterns.map((pattern, i) => {
                                    return (
                                        <button 
                                            className={"patternButton"}
                                            style={track.currPattern === i  ? {backgroundColor: "#283845"} : pattern.some(v => v) ? {backgroundColor: "#F29559"} : {backgroundColor: "#747474"}}
                                            key={i}
                                            onClick={ () => {
                                                this.props.patternMode === true ? 
                                                    this.props.addTrackPatern(track.id, i)
                                                    : 
                                                    this.props.changeTrackPattern(track.id, i);
                                            }}
                                        >
                                            {i+1}
                                        </button>
                                    );
                                })
                                }
                            </div>
                            <div>
                                <Selector id={track.id} source={samples} current={track.name} onChange={this.props.updateTrackSample} /><div/>
                                <Selector id={track.id} source={this.props.notes} current={track.note} onChange={this.props.updateTrackNote} />
                            </div>
                        </div>
                    );
                })
            }
        </div>

    );
}
}
export default TracksComponent;