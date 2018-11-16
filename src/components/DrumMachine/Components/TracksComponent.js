/* eslint-disable no-unused-vars */
import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import ClearIcon from "@material-ui/icons/DeleteTwoTone";
import Slider, { Range } from "rc-slider";
import { CircleSlider } from "react-circle-slider";
import SampleSelector from "./SampleSelector";
import "rc-slider/assets/index.css";

class TracksComponent extends React.Component {

    render() {
        return (
            <div  className={"TrackComponent"}>
                {
                    this.props.tracks.map((track, i) => {
                        return (
                            <div key={i} style={{float: "left", height:"200px", width: "80px", bottom: 0, textAlign: "center"}} className="controls">
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
                                        <Checkbox
                                            style={{color: "#283845"}}
                                            checked={!track.muted}
                                            onChange={() => this.props.muteTrack(track.id)}
                                        />
                                    </div>
                                    <div>
                                        {track.beats.some(v => v) ?
                                            <a href="" title="Clear track" onClick={event => {
                                                event.preventDefault();
                                                this.props.clearTrack(track.id);
                                            }}><ClearIcon name="delete"/></a> :
                                            <ClearIcon className="disabled-icon" name="delete"/>}
                                    </div>
                                    <div
                                        style={{width: "10px", 
                                            height: "10px", 
                                            borderRadius: "50%" ,
                                            backgroundColor: track.beats[this.props.index] == true ? "red" : "black" 
                                        }}
                                    />
                                </div>
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
                                    <SampleSelector id={track.id} current={track.name} onChange={this.props.updateTrackSample} />
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