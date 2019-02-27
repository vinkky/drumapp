/* eslint-disable no-unused-vars */
import React from "react";
import Slider, { Range } from "rc-slider";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import VolumeOffIcon from "@material-ui/icons/volumeoff";
import VolumeOnIcon from "@material-ui/icons/volumeup";
import ClearIcon from "@material-ui/icons/clear";
import PatternIcon from "@material-ui/icons/repeat";
import Selector from "./SampleSelector";
import samples from "../../../sounds/drums.json";
import "rc-slider/assets/index.css";

const TracksComponent = (props) => {
  return (
    <div  className={"TrackComponent"}>
      {
        props.tracks.map((track, i) => {
          return (
            <div key={track.id} style={{marginBottom: "5px", backgroundColor: "#b9b9b9", float: "left", height:"220px", width: "96px", bottom: 0, textAlign: "center", border: "2px solid #c3c3c3", marginLeft: "4px", borderRadius: "4px"}} className="controls">
              <div
                style={{width: "10px", 
                  height: "10px", 
                  borderRadius: "50%",
                  backgroundColor: i == props.selectedTrack ? "red" : "black" 
                }}
              />
              <div>
                <Slider
                  style={{marginLeft: "42px", height:"60px"}}
                  min={-62}
                  defaultValue={1}
                  max={12} 
                  step={3.7}
                  vertical={true}
                  onChange={value => props.setTrackVolume(track.id, parseFloat(value))}
                />
              </div>
              <div>
                <div className="mute">
                  {
                    !track.muted ? 
                      <VolumeOnIcon
                        style={{color: "#283845", cursor: "pointer"}}
                        onClick={() => props.muteTrack(track.id)}
                      /> :
                      <VolumeOffIcon
                        style={{color: "#283845", cursor: "pointer"}}
                        onClick={() => props.muteTrack(track.id)}
                      />
                  }
                </div>
                <div>
                  {track.beats.some(v => v) ?
                    <a href="" title="Clear track" onClick={event => {
                      event.preventDefault();
                      props.clearTrack(track.id);
                    }}><ClearIcon name="delete"/></a> :
                    <ClearIcon className="disabled-icon" name="delete"/>}
                  <DeleteIcon 
                    style={{cursor: "pointer"}}
                    onClick={() => {props.deleteTrack(track.id);}}
                    className="disabled-icon"/>
                  <PatternIcon
                    style={{cursor: "pointer"}}
                    onClick={() => {props.switchPatternMode(track.id);}}
                    className={track.switchMode ?  null : "disabled-icon"}
                  />
                </div>
              </div>
              <div
                style={{width: "10px", 
                  height: "10px", 
                  borderRadius: "50%",
                  margin: "0px auto",
                  backgroundColor: track.beats[props.index] == true ? "red" : "black" 
                }}
              />
              <div class="Switches">
                {track.switchPatterns.map((pattern, i) => {
                  return (
                    <button 
                      style={!track.switchMode ?{backgroundColor: "#A5A5A5"} : i == props.currentBar ? {backgroundColor: "#283845"} : {backgroundColor: "#747474"}}
                      className="patternSelectBtn"
                      key={i}
                      onClick={ () => {
                        props.toggleSwitchPattern(track.id, i);
                      }}
                    >
                      {pattern + 1}
                    </button>
                  );
                })
                }
              </div>
              <div>
                {track.patterns.map((pattern, i) => {
                  return (
                    <button 
                      className={"patternButton"}
                      style={track.currPattern === i  ? {backgroundColor: "#283845"} : pattern.some(v => v) ? {backgroundColor: "#F29559"} : {backgroundColor: "#747474"}}
                      key={i}
                      onClick={ () => {
                        props.patternMode === true  ? 
                          props.addTrackPatern(track.id, i)
                          : 
                          props.changeTrackPattern(track.id, i);
                      }}
                    >
                      {i+1}
                    </button>
                  );
                })
                }
              </div>
              <div>
                <Selector id={track.id} source={samples} current={track.name} onChange={props.updateTrackSample} /><div/>
                <Selector id={track.id} source={props.notes} current={track.note} onChange={props.updateTrackNote} />
              </div>
            </div>
          );
        })
      }
    </div>
  );
};
export default TracksComponent;