import React from "react";

class SequenceBar extends React.Component {
  state = {
      instrument: 0
  };

  componentWillMount() {
      window.addEventListener("keydown", this.handleKeyboardInput.bind(this));
  }

  handleKeyboardInput = e => {
      const code = e.keyCode ? e.keyCode : e.which;
      switch (code) {
      case 49:
          this.setState({ instrument: 0 });
          break;
      case 50:
          this.setState({ instrument: 1 });
          break;
      case 51:
          this.setState({ instrument: 2 });
          break;
      case 52:
          this.setState({ instrument: 3 });
          break;
      case 53:
          this.setState({ instrument: 4 });
          break;
      default:
          return false;
      }
  };
  render() {
      return (
          <table>
              <tbody>
                  {this.props.patternMode ?
                      this.props.tracks.map((track, i) => {
                          return (
                              <tr key={i} className="track" >
                                  { i === this.state.instrument ? 
                                      track.beats.map((v, beat) => {
                                          const sequenceClass = v && beat === this.props.index ? "circleIndicator" : v ? "currentBeat circleIndicator" : beat === this.props.index ? "currentBeat circleIndicator" : "circleIndicator";
                                          return (
                                              <td key={beat} className={"beat"} onClick={(event) => {
                                                  event.preventDefault();
                                                  this.props.toggleTrackBeat(track.id, beat);
                                              }}>
                                                  <br/>
                                                  <a href="" onClick={(event) => {
                                                      event.preventDefault();
                                                      this.props.toggleTrackBeat(track.id, beat);
                                                  }} ><div 
                                                          className={sequenceClass}
                                                      />
                                                     
                                                  </a>
                                                  <strong className={"SequenceNumbers"}>
                                                      {beat+1}
                                                  </strong>
                                              </td>
                                          );
                                      }) : null
                                  }
                              </tr>
                          );
                      }) :
                      <tr className="track" > {
                          this.props.pattern.map((v, beat) => {
                              const sequenceClass = v && beat === this.props.index ? "circleIndicator" : v ? "currentBeat circleIndicator" : beat === this.props.index ? "currentBeat circleIndicator" : "circleIndicator";
                              return (
                                  <td key={beat} className={"beat"} onClick={(event) => {
                                      event.preventDefault();
                                      this.props.togglePaternBeat(beat);
                                  }}>
                                      <br/>
                                      <a href="" onClick={(event) => {
                                          event.preventDefault();
                                          this.props.togglePaternBeat(beat);
                                      }} ><div 
                                              className={sequenceClass}
                                          />
                                   
                                      </a>
                                      <strong className={"SequenceNumbers"}>
                                          {beat+1}
                                      </strong>
                                  </td>
                              );
                          })
                      }
                      
                      </tr>
                      
                  }</tbody>
          </table>
      );
  }
}

export default SequenceBar;