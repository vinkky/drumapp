/* eslint-disable no-unused-vars */
import React  from "react";
import * as OneShotsControls from "../Controls/OneShotsControls";
import Samples from "../../../samples.json";
import Selector from "./SampleSelector";

class OneshotComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oneShots: [
        {id: 1,  name: "kick-808", keyCode: 81, keyEdit: false},
        {id: 2,  name: "clap-808", keyCode: 87, keyEdit: false},
        {id: 3,  name: "snare-808", keyCode: 69, keyEdit: false},
        {id: 4,  name: "hihat-808", keyCode: 82, keyEdit: false}
      ],
      caps: null
    };
  }

  componentDidMount() {
    document.addEventListener( "keydown", ( event ) => {
      var caps = event.getModifierState && event.getModifierState( "CapsLock" );
      this.setState({caps: caps});
    });
  }

  updateSamples = (newOneShots) => {
    this.setState({oneShots: newOneShots});
  };

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
      <div>
        {this.state.oneShots.map((oneShot, i) => {
          return (
            <OneShot
              key={i}
              changeKeycode={this.changeKeycode }
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
      onKeyPress={(e) => props.changeKeycode(e, props.oneShot.id)}
    >
      <Selector 
        id={props.oneShot.id} 
        source={Samples} 
        current={props.oneShot.name} 
        onChange={props.updateTrackSample}
      />
      <button>{String.fromCharCode(props.oneShot.keyCode)}</button>
    </div>);
}