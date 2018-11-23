/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
import Tone from "tone";
import Slider from "rc-slider";
import { CircleSlider } from "react-circle-slider";

class BassComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bassNotes: ["f#2", "f#1", "g2", "g1"],
      volume: -10,
      distortion: 2.5,
      delay: 0.25,
      frequency: 1.25,
      baseFrequency: 2500

    };
    let bassline = this.setup(this.state.volume, this.state.distortion, this.state.delay, this.state.frequency, this.state.baseFrequency);
    this.pattern = new Tone.Pattern(function(time, note) {
      bassline.triggerAttackRelease(note, "8n", time);
    }, this.state.bassNotes);
  }

  setup = (vol, dist, del, freq, bfreq) => {
    let bassline = new Tone.FMSynth();
    let basslineVolume = new Tone.Volume(vol);
    let basslineDistortion = new Tone.Distortion(dist);
    let basslineDelay = new Tone.FeedbackDelay(del);
    let basslinePhaser = new Tone.Phaser({
      frequency: freq,
      depth: 15,
      baseFrequency: bfreq
    });
    bassline.chain(basslineDistortion, basslineDelay);
    bassline.chain(basslineDistortion, basslinePhaser);
    bassline.chain(basslinePhaser, basslineVolume);
    bassline.chain(basslineVolume, Tone.Master);
    return bassline;
  };
  render() {
    if (Tone.Transport.state == "started") {
       this.pattern.start();
    } else {
      // this.pattern.stop();
    }

    // Tone.Transport.setInterval(function(time){

    //   if(this.state.stepNumber == 0) {
    //     this.updateState({scoreId: this.state.scoreId++});
    //     this.updateState({scoreId: this.state.scoreId % 4});
    //   }
    //   // Playing the bassline
    //   if (this.basslineNotes) {
    //     var basslineNote = this.state.basslineNotes[this.state.basslineNotesPosition++];
    //     this.updateState({basslineNotesPosition: this.state.basslineNotesPosition % this.state.basslineNotes.length});

    //     if (basslineNote != null) {
    //       this.bassline.triggerAttackRelease(basslineNote,
    //         "64n",
    //         time);
    //     }
    //   }
    //   this.updateState({stepNumber: this.state.stepNumber++});
    //   this.updateState({stepNumber: this.state.stepNumber% 32});
    // }, "16n");

    return (
      <div style={{ width: "150px", height: "200px" }}>
        <Slider
          style={{ width: "100px" }}
          min={-60}
          defaultValue={40}
          max={10}
          step={3.5}
          //onChange={value => changeVolume(parseFloat(value))}
        />
        <NoteSelect />
        <EffectControls />
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
          value={10}
          min={30}
          max={240}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          //onChange={value => this.updateBPM(parseFloat(value))}
        />
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={10}
          min={30}
          max={240}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          // onChange={value => this.updateBPM(parseFloat(value))}
        />
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={10}
          min={30}
          max={240}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          //onChange={value => this.updateBPM(parseFloat(value))}
        />
        <CircleSlider
          className={"CircleKnob"}
          circleColor={"#283845"}
          progressColor={"#B8B08D"}
          knobColor={"#B8B08D"}
          value={10}
          min={30}
          max={240}
          size={40}
          knobRadius={5}
          circleWidth={5}
          progressWidth={5}
          //onChange={value => this.updateBPM(parseFloat(value))}
        />
      </div>
    );
  }
}

export default BassComponent;
