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
        {id: 1,  name: "kick-808", keyCode: "81", keyEdit: false},
        {id: 2,  name: "clap-808", keyCode: 87, keyEdit: false},
        {id: 3,  name: "snare-808", keyCode: 69, keyEdit: false},
        {id: 4,  name: "hihat-808", keyCode: 82, keyEdit: false}
      ]
    };
  }

  updateSamples = (newOneShots) => {
    this.setState({tracks: newOneShots});
  };
  handleKeyPress = (event, id) => {
    this.changeKeycode(id, event.key);
    console.log(id);
    console.log(this.state.oneShots);
  }
  changeKeycode = (id, keyCode) => {
    console.log("suveike")
    const {oneShots} = this.state;
    this.updateSamples(OneShotsControls.changeKeycode(oneShots, id, keyCode));
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
              handleKeyPress={this.handleKeyPress}
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
      onKeyPress={(e) => props.handleKeyPress(e, props.oneShot.id)}
    >
      <Selector id={props.oneShot.id} source={Samples} current={props.oneShot.name} onChange={props.updateTrackSample} />
      <button>{String.fromCharCode(props.oneShot.keyCode)}</button>
    </div>);
}