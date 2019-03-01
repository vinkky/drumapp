import React from "react";
import Slider, { Range } from "rc-slider";

class AutomationComponent extends React.Component {
  render() {
    return (
      <div>
          freq<Slider
          style={{width: "100px"}}
          min={-60}
          defaultValue={50}
          max={10} 
          step={3.5}
          //onChange={value => changeVolume(parseFloat(value))}
        />
        <Range 
          style={{width: "100px"}}
          min={0} 
          max={1000} 
          defaultValue={[3, 10]} 
          onChange={value => console.log(`${value}%`)} 
        />
      </div>
    );
  }
}

export default AutomationComponent;
