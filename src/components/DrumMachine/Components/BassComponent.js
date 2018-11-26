/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
import Tone from "tone";
import CustomButton from "./CustomButton";
import * as BassControls from "../Controls/BassControls";
import Selector from "./SampleSelector";
import Slider from "rc-slider";
import { CircleSlider } from "react-circle-slider";

class BassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: -10,
      distortion: 2.5,
      delay: 0.25,
      frequency: 1.25,
      baseFrequency: 2500,
      bassNotes: ["f#2", "f#1", "g2", "g1"],
      pattern: "upward",
      patterns: ["upward", "downward", "upDown", "downUp", "alternateUp", "alternateDown", "random", "randomWalk", "randomOnce"],
      bassNoteArray: [["f#2", "f#1", "g2", "g1"],  ["c#2", "c#1", "g2", "g1"],  ["g#2", "g#1", "g2", "g1"],  ["b#2", "b#1", "g2", "g1"]]

    };

    this.bass = BassControls.create(this.state.volume, this.state.distortion, this.state.delay, this.state.frequency, this.state.baseFrequency, this.state.bassNotes, "upDown");

    //pattern functionality
    this.bass.pattern = "alternateUp";
    this.bass.values = ["f#2", "f#1", "g2", "g1"];
    this.bass.humanize = true;

    
    // this.pattern = new Tone.Pattern(function(time, note) {
    //   bassline.triggerAttackRelease(note, "8n", time);
    // }, this.state.bassNotes);
  }

  changeVolume = (val) => {
   const {volume, distortion, delay, frequency, baseFrequency} = this.state;
   this.setState({volume : val});
   this.bass = BassControls.update(this.bass, volume, distortion, delay, frequency, baseFrequency);
 }
  changeDistortion = (val) => {
   const {volume, distortion, delay, frequency, baseFrequency} = this.state;
   this.setState({distortion : val});
   this.bass = BassControls.update(this.bass, volume, distortion, delay, frequency, baseFrequency);
 }
  changeDelay = (val) => {
   const {volume, distortion, delay, frequency, baseFrequency} = this.state;
   this.setState({delay : val});
   this.bass = BassControls.update(this.bass, volume, distortion, delay, frequency, baseFrequency);
 }
  changeFrequency = (val) => {
   const {volume, distortion, delay, frequency, baseFrequency} = this.state;
   this.setState({frequency : val});
   this.bass = BassControls.update(this.bass, volume, distortion, delay, frequency, baseFrequency);
 }
  changeBaseFrequency = (val) => {
   const {volume, distortion, delay, frequency, baseFrequency} = this.state;
   this.setState({baseFrequency : val});
   this.bass = BassControls.update(this.bass, volume, distortion, delay, frequency, baseFrequency);
 }
 updatePattern = (id, sample) => {
  this.setState({pattern: sample});
  this.bass.pattern = sample;
 }
 updateNote = (id, sample) => {
  this.setState({bassNotes: sample});

  //this.bass.values = sample;
 }
  render() {

    return (
      <div style={{ width: "150px", height: "200px" }}>
        <Slider
          style={{ width: "100px" }}
          min={-60}
          defaultValue={-12}
          max={10}
          step={1}
          onChange={value => this.changeVolume(parseFloat(value))}
        />
        <Selector id={""} source={this.state.patterns} current={this.state.pattern} onChange={this.updatePattern} />
        <Selector id={""} source={this.state.bassNoteArray} current={this.state.bassNotes} onChange={this.updateNote} />
        <NoteSelect/>
        <EffectControls
         changeDistortion={this.changeDistortion}
         changeDelay={this.changeDelay}
         changeFrequency={this.changeFrequency}
         changeBaseFrequency={this.changeBaseFrequency} />
        <CustomButton 
           source={this.bass}
           click={"Start"}
           unclick={"Stop"}/>
      </div>
    );
  }
}

class NoteSelect extends React.Component {
  render() {
    return <div />;
  }
}
class EffectControls extends React.Component {
  render() {
    return (
      <div>
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={2.5}
          min={0}
          max={5}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          onChange={value => this.props.changeDistortion(parseFloat(value))}
        />
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={0.25}
          min={0}
          max={1}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          onChange={value => this.props.changeDelay(parseFloat(value))}
        />
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={1.25}
          min={-10}
          max={200}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          onChange={value => this.props.changeFrequency(parseFloat(value))}
        />
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={2500}
          min={0}
          max={5000}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          onChange={value => this.props.changeBaseFrequency(parseFloat(value))}
        />
      </div>
    );
  }
}

export default BassComponent;
