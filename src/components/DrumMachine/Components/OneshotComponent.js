/* eslint-disable no-unused-vars */
import React  from "react";
import Tone from "tone";
import * as OneShotsControls from "../Controls/OneShotsControls";
import * as controls from "../Controls/Trackcontrols";
import Samples from "../../../sounds/shots.json";
import LoopSamples from "../../../sounds/loops.json";
import Selector from "./SampleSelector";
import LoopIcon from "@material-ui/icons/repeat";
import Slider from "rc-slider";

const styles = {
  div1: {
    backgroundColor: "#b9b9b9", 
    float: "left", 
    width: "96px", 
    bottom: 0, 
    textAlign: "center",
    border: "2px solid #c3c3c3", 
    borderRadius: "4px", 
    marginLeft: "4px", 
    marginBottom: "4px"
  },
  col1: {
    width: "20px", 
    color: "black"
  },
  col2: {
    width: "20px", 
    color: "red"
  }
};

class OneshotComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      oneShots: [
        {id: 1,  name: "Bass_1", vol: 0, keyCode: 81, loop: false, keyEdit: false},
        {id: 2,  name: "Bass_2", vol: 0, keyCode: 87, loop: false, keyEdit: false},
        {id: 3,  name: "Bass_3", vol: 0, keyCode: 69, loop: false, keyEdit: false},
        {id: 4,  name: "Bass_4", vol: 0, keyCode: 82, loop: false, keyEdit: false},
        {id: 5,  name: "Bass_5", vol: 0, keyCode: 84, loop: false, keyEdit: false},
        {id: 6,  name: "Bass_6", vol: 0, keyCode: 89, loop: false, keyEdit: false},
        {id: 7,  name: "Bass_7", vol: 0, keyCode: 85, loop: false, keyEdit: false},
        {id: 8,  name: "Bass_8", vol: 0, keyCode: 73, loop: false, keyEdit: false},
        {id: 9,  name: "Bass_9", vol: 0, keyCode: 79, loop: false, keyEdit: false}
      ],
      caps: null
    };

    this.oneshotPlayer = OneShotsControls.create(this.state.oneShots);
  }

  componentWillMount() {
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
    // pasizieti sita ir pasitikrinti kaip ten su tais erorais
    this.oneshotPlayer.get(result.name).loop = result.loop;
    this.oneshotPlayer.get(result.name).start().volume.value = result.vol;
    //Tone.now()+2.3
    //pasizieti su tuo time now jei pvz noriu kad butu sync butonas tada sync pagal viska jei ne tai ta tone now 2.3 palikt paprasta
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
    this.stop(OneShotsControls.getSampleByID(oneShots, id));
    this.updateSamplePlayer(controls.updateTrackSample(oneShots, id, sample));
  };

  loopShot = (id) => {
    const {oneShots} = this.state;
    this.updateSamples(OneShotsControls.loopShot(oneShots, id));
  };

 updateSamplePlayer = (newTracks) => {
   this.oneshotPlayer = OneShotsControls.update(this.oneshotPlayer, newTracks);
   this.setState({oneShots: newTracks});
 };

  changeVolume = (id, vol) => {
    const {oneShots} = this.state;
    this.updateSamples(controls.setTrackVolume(oneShots , id, vol));
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
      <div style={{float: "left"}}>
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
  const {oneShot} = props;
  return (
    <div
      style={styles.div1}
      onKeyPress={(e) => props.changeKeycode(e, props.oneShot.id)}
    >
      <Selector 
        id={oneShot.id} 
        source={LoopSamples} 
        current={oneShot.name} 
        onChange={props.updateShotName}
      />
      <Slider
        style={{width: "70px"}}
        min={-60}
        defaultValue={oneShot.vol}
        max={10} 
        step={3.5}
        onChange={value => props.changeVolume(oneShot.id, parseFloat(value))}
      />
      <button style={styles.col1}className={"patternButton"}>{String.fromCharCode(oneShot.keyCode)}</button>
      <LoopIcon style={oneShot.loop ? styles.col2 : styles.col1}
        className={"patternButton"} 
        onClick={() => {
          !oneShot.loop ?
            props.loopShot(oneShot.id)
            :
            props.stop(oneShot.name);
          props.loopShot(oneShot.id);
        }
        }
      >R</LoopIcon>
    </div>);
}