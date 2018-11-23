/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import React from "react";
import CustomButton from "./CustomButton";
import Tone from "tone";
import Slider from "rc-slider";

class NoiseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noises: ["white", "pink", "brown"],
      currentType: 1,
      baseFrequency: 40,
      octaves: 2.6,
      volume: -30
    };
    this.noise = new Tone.Noise(this.state.noises[this.state.currentType]);
    //make an autofilter to shape the noise
    this.autoFilter = new Tone.AutoFilter({
      baseFrequency: this.state.baseFrequency,
      octaves: this.state.octaves,
      min : 800,
      max : 15000
    }).connect(Tone.Master);
    //connect the noise
    this.noise.connect(this.autoFilter);
    //start the autofilter LFO
    this.autoFilter.start();
  }

   nextNoise = () => {
     this.setState({currentType:  (this.state.currentType + 1) % this.state.noises.length});
     this.noise.type = this.state.noises[this.state.currentType];
   }
   prevNoise = () => {
     this.setState({currentType: (this.state.currentType - 1 + this.state.noises.length) % this.state.noises.length});
     this.noise.type = this.state.noises[this.state.currentType];
   }
   changeVolume = (val) => {
     this.setState({volume : val});
     this.noise.volume.value = this.state.volume;
   }
   changeFreq = (val) => {
     this.setState({baseFrequency : val});
     this.autoFilter.baseFrequency = this.state.baseFrequency;
   }
   changeOctaves = (val) => {
     this.setState({octaves : val});
     this.autoFilter.octaves = this.state.octaves;
   }
   render() {
     this.autoFilter.frequency.value = 50;
     return (
       <div style={{width: "120px", height: "170px", border: "1px solid black"}}>
         <NoiseSelect
           nextNoise={this.nextNoise}
           prevNoise={this.prevNoise}
           noises={this.state.noises}
           currentType={this.state.currentType}/>
         <NoiseControls
           changeVolume={this.changeVolume}
           changeFreq={this.changeFreq}
           changeOctaves={this.changeOctaves}
           volume={this.state.volume}
           frequency={this.state.baseFrequency}
           octaves={this.state.octaves}
         />
         <CustomButton 
           source={this.noise}
           click={"Start"}
           unclick={"Stop"}/>
       </div>
     );
   }
}

class NoiseSelect extends React.Component {
  render() {
    const {prevNoise, noises, currentType, nextNoise} = this.props;
    return (
      <div style={{textAlign: "center"}}>
        <button style={{display: "inline"}} onClick={prevNoise}>	&lt; </button>
        <div style={{display: "inline-block", width: "70px"}}>{noises[currentType]}</div>
        <button style={{display: "inline"}} onClick={nextNoise}> &gt; </button>
      </div>
    );
  }
}

class NoiseControls extends React.Component {
  render() {
    const {volume, frequency, octaves, changeVolume, changeFreq, changeOctaves} = this.props;
    return (
      <div>
        volume<Slider
          style={{width: "100px"}}
          min={-60}
          defaultValue={volume}
          max={10} 
          step={3.5}
          onChange={value => changeVolume(parseFloat(value))}
        />
        frequency<Slider
          style={{width: "100px"}}
          min={0}
          defaultValue={frequency}
          max={300} 
          step={1}
          onChange={value => changeFreq(parseFloat(value))}
        />
        octaves<Slider
          style={{width: "100px"}}
          min={0}
          defaultValue={octaves}
          max={10} 
          step={0.1}
          onChange={value => changeOctaves(parseFloat(value))}
        />
      </div>
    );
  }
}
export default NoiseComponent;