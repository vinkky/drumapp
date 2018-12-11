/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import React from "react";
import CustomButton from "./CustomButton";
import Tone from "tone";
import Slider from "rc-slider";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowLeftIcon from "@material-ui/icons/keyboardarrowleft";
import ArrowRightIcon from "@material-ui/icons/keyboardarrowright";
import Switch from "@material-ui/core/Switch";

class EffectsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTypes: ["lowpass", "highpass", "bandpass"],
      currentType: 0,
      frequency: 1,
      baseFrequency: 200,
      octaves: 2.6,
      wet: 0,
      checked: false
    };
    this.autoFilter = new Tone.AutoFilter ({
      frequency  : this.state.frequency ,
      type: "sine" ,
      depth: 1 ,
      baseFrequency: this.state.baseFrequency ,
      octaves: 2.6 ,
      filter: {
        type: this.state.filterTypes[this.state.currentType] ,
        rolloff: -24,
        Q: 1
      },
      wet: this.state.wet
    });
    //and filter before going to the speakers
    Tone.Master.chain(this.autoFilter);
  }
   nextNoise = () => {
     this.setState({currentType:  (this.state.currentType + 1) % this.state.filterTypes.length});
     this.autoFilter.filter.type = this.state.filterTypes[(this.state.currentType + 1) % this.state.filterTypes.length];
   }
   prevNoise = () => {
     this.setState({currentType: (this.state.currentType - 1 + this.state.filterTypes.length) % this.state.filterTypes.length});
     this.autoFilter.filter.type = this.state.filterTypes[(this.state.currentType - 1 + this.state.filterTypes.length) % this.state.filterTypes.length];
   }
   changeWet = (val) => {
     this.setState({wet : val});
     if(this.state.checked) {
       this.autoFilter.wet.value = this.state.wet;
     }
   }
   changeFreq = (val) => {
     this.setState({baseFrequency : val});
     this.autoFilter.baseFrequency = this.state.baseFrequency;
   }
   changeOctaves = (val) => {
     this.setState({octaves : val});
     this.autoFilter.octaves = this.state.octaves;
   }
   handleChange = name => event => {
     this.setState({ [name]: event.target.checked });
     if (this.state.checked) {
       this.autoFilter.wet.value = 0;
     }else {
       this.autoFilter.wet.value = this.state.wet;
     }
     console.log(this.state.checked);
   };
   render() {
     return (
       <div style={{backgroundColor: "#747474", border: "2px solid #c3c3c3", borderRadius: "4px", width: "120px", height: "170px", paddingLeft: "10px", paddingRight: "10px"}}>
         <h5 style={{textAlign: "center", margin: "0px auto"}}>master filter</h5>
         <FilterSelect
           nextNoise={this.nextNoise}
           prevNoise={this.prevNoise}
           filterTypes={this.state.filterTypes}
           currentType={this.state.currentType}/>
         <NoiseControls
           changeWet={this.changeWet}
           changeFreq={this.changeFreq}
           changeOctaves={this.changeOctaves}
           wet={this.state.wet}
           frequency={this.state.baseFrequency}
           octaves={this.state.octaves}
         />
         <FormControlLabel
           control={
             <Switch
               checked={this.state.checked}
               onChange={this.handleChange("checked")}
               value="checked"
             />
           }
           label={this.state.checked? "on" : "off"}
         />
       </div>
     );
   }
}

class FilterSelect extends React.Component {
  render() {
    const {prevNoise, filterTypes, currentType, nextNoise} = this.props;
    return (
      <Grid container style={{marginTop: "5px", textAlign: "center", height: "20px"}}>
        <Grid item xs={2}>
          <ArrowLeftIcon
            style={{color: "#283845", cursor: "pointer"}}
            onClick={prevNoise} 
          />
        </Grid>
        <Grid item xs={8}>
          <h4 style={{marginLeft: "2px", marginTop: "3px"}}>{filterTypes[currentType]}</h4>
        </Grid>
        <Grid item xs={2}>
          <ArrowRightIcon
            style={{color: "#283845", cursor: "pointer"}}
            onClick={prevNoise}
          />
        </Grid>
      </Grid>
    );
  }
}

class NoiseControls extends React.Component {
  render() {
    const {wet, frequency, octaves, changeWet, changeFreq, changeOctaves} = this.props;
    return (
      <div>
        wet<Slider
          style={{width: "100px"}}
          min={0}
          defaultValue={wet}
          max={1} 
          step={0.1}
          onChange={value => changeWet(parseFloat(value))}
        />
        frequency<Slider
          style={{width: "100px"}}
          min={0}
          defaultValue={frequency}
          max={200} 
          step={0.5}
          onChange={value => changeFreq(parseFloat(value))}
        />
        octaves<Slider
          style={{width: "100px"}}
          min={-10}
          defaultValue={octaves}
          max={10} 
          step={0.1}
          onChange={value => changeOctaves(parseFloat(value))}
        />
      </div>
    );
  }
}
export default EffectsComponent;