/* eslint-disable no-unused-vars */
import React  from "react";
import Tone from "tone";
import * as OneShotsControls from "../Controls/OneShotsControls";
import Samples from "../../../sounds/shots.json";
import LoopSamples from "../../../sounds/loops.json";
import Selector from "./SampleSelector";
import LoopIcon from "@material-ui/icons/repeat";
import Slider from "rc-slider";

class OneshotComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oneShots: [
        {id: 1,  name: "shot_01", vol: 0, keyCode: 81, loop: false, keyEdit: false},
        {id: 2,  name: "shot_02", vol: 0, keyCode: 87, loop: false, keyEdit: false},
        {id: 3,  name: "shot_03", vol: 0, keyCode: 69, loop: false, keyEdit: false},
        {id: 4,  name: "shot_04", vol: 0, keyCode: 82, loop: false, keyEdit: false},
        {id: 5,  name: "shot_05", vol: 0, keyCode: 84, loop: false, keyEdit: false},
        {id: 6,  name: "shot_06", vol: 0, keyCode: 89, loop: false, keyEdit: false},
        {id: 7,  name: "shot_07", vol: 0, keyCode: 85, loop: false, keyEdit: false},
        {id: 8,  name: "shot_08", vol: 0, keyCode: 73, loop: false, keyEdit: false},
        {id: 9,  name: "shot_09", vol: 0, keyCode: 79, loop: false, keyEdit: false}
      ],
      caps: null
    };

    this.oneshotPlayer = OneShotsControls.create(this.state.oneShots);
  }

  componentDidMount() {
    document.addEventListener( "keydown", ( event ) => {
      var caps = event.getModifierState && event.getModifierState( "CapsLock" );
      this.setState({caps: caps});
    });
    document.addEventListener( "keypress", ( e ) => {
      const code = e.charCode;
      const lowerCode = code-32;
      if(this.state.caps) {
        if(this.state.oneShots.some(obj => obj.keyCode === code)){
          this.play(code);
        }
      }else {
        if(this.state.oneShots.some(obj => obj.keyCode ===  lowerCode)){
          this.play(lowerCode);
        }
      }
    });
  }


  play = (code) => {
    const {oneShots} = this.state;
    var result = oneShots.find(obj => {
      return obj.keyCode === code;
    });
    this.oneshotPlayer.get(result.name).loop = result.loop;
    this.oneshotPlayer.get(result.name).start(Tone.now()+2.3).volume.value = result.vol;
  }
  stop = (name) => {
    this.oneshotPlayer.fadeOut="8n";
    this.oneshotPlayer.get(name).stop();
  }
  updateSamples = (newOneShots) => {
    this.setState({oneShots: newOneShots});
  };

  updateShotName = (id, sample) => {
    const {oneShots} = this.state;
    this.updateSamplePlayer(OneShotsControls.updateShotName(oneShots, id, sample));
  };

  loopShot = (id) => {
    const {oneShots} = this.state;
    this.updateSamples(OneShotsControls.loopShot(oneShots, id));
    console.log(this.state.oneShots);
  };

 updateSamplePlayer = (newTracks) => {
   this.oneshotPlayer = OneShotsControls.update(this.oneshotPlayer, newTracks);
   this.setState({oneShots: newTracks});
 };

  changeVolume = (id, vol) => {
    const {oneShots} = this.state;
    this.updateSamples(OneShotsControls.changeVolume(oneShots , id, vol));
  }

  changeKeycode = (keyCode, id) => {
    const {oneShots} = this.state;
    //Check if caps are on
    if(this.state.caps) {
    // If it is compare current char codes with new one so they won't overlap
      if(oneShots.every(obj => obj.keyCode !== keyCode.charCode)){
        this.updateSamples(OneShotsControls.changeKeycode(oneShots, id, keyCode.charCode));
      }
    } else {
      // If caps are off compare current char codes with new one converted to upper cap
      if(oneShots.every(obj => obj.keyCode !== keyCode.charCode-32)){
        this.updateSamples(OneShotsControls.changeKeycode(oneShots, id, keyCode.charCode-32));
      }
    }
  };

  switchKeyEdit = (id, bool) => {
    const {oneShots} = this.state;
    this.updateSamples(OneShotsControls.switchKeyEdit(oneShots, id, bool));
  };

  render() {
    return (
      <div style={{float: "left", marginLeft: "100px"}}>
        {this.state.oneShots.map((oneShot, i) => {
          return (
            <OneShot
              key={i}
              changeKeycode={this.changeKeycode}
              updateShotName={this.updateShotName}
              changeVolume={this.changeVolume}
              loopShot={this.loopShot}
              stop={this.stop}
              oneShot={oneShot}/>
          );
        })
        }
      </div>
    );
  }
}

export default OneshotComponent;


function OneShot(props) {
  return (
    <div
      style={{backgroundColor: "#b9b9b9", float: "left", width: "90px", bottom: 0, textAlign: "center", border: "2px solid #454545", marginLeft: "4px"}}
      onKeyPress={(e) => props.changeKeycode(e, props.oneShot.id)}
    >
      <Selector 
        id={props.oneShot.id} 
        source={LoopSamples} 
        current={props.oneShot.name} 
        onChange={props.updateShotName}
      />
      <Slider
        style={{width: "70px"}}
        min={-60}
        defaultValue={props.oneShot.vol}
        max={10} 
        step={3.5}
        onChange={value => props.changeVolume(props.oneShot.id, parseFloat(value))}
      />
      <button style={{width: "20px", color: "black"}}className={"patternButton"}>{String.fromCharCode(props.oneShot.keyCode)}</button>
      <LoopIcon style={props.oneShot.loop ? {width: "20px", color: "red"} : {width: "20px", color: "black"}}
        className={"patternButton"} 
        onClick={() => {
          !props.oneShot.loop ?
            props.loopShot(props.oneShot.id)
            :
            props.stop(props.oneShot.name);
          props.loopShot(props.oneShot.id);
        }
        }
          
          
      >R</LoopIcon>
    </div>);
}