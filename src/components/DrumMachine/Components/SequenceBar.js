import React from "react";

class SequenceBar extends React.Component {

  render() {
    return (
      <table>
        <tbody>
          {!this.props.patternMode ? (
            this.props.tracks.map((track, i) => {
              return (
                <tr key={i} className="track">
                  {i === this.props.selectedTrack
                    ? track.beats.map((v, beat) => {
                      const sequenceClass =
                          v && beat === this.props.index
                            ? "circleIndicator"
                            : v
                              ? "currentBeat circleIndicator"
                              : beat === this.props.index
                                ? "currentBeat circleIndicator"
                                : "circleIndicator";
                      return (
                        <td
                          key={beat}
                          className={"beat"}
                          onClick={event => {
                            event.preventDefault();
                            this.props.toggleTrackBeat(track.id, beat);
                          }}
                        >
                          <br />
                          <a
                            href=""
                            onClick={event => {
                              event.preventDefault();
                              this.props.toggleTrackBeat(track.id, beat);
                            }}
                          >
                            <div className={sequenceClass} />
                          </a>
                          <strong className={"SequenceNumbers"}>
                            {beat + 1}
                          </strong>
                        </td>
                      );
                    })
                    : null}
                </tr>
              );
            })
          ) : (
            <tr className="track">
              {" "}
              {this.props.pattern.map((v, beat) => {
                const sequenceClass =
                  v && beat === this.props.index
                    ? "circleIndicator"
                    : v
                      ? "currentBeat circleIndicator"
                      : beat === this.props.index
                        ? "currentBeat circleIndicator"
                        : "circleIndicator";
                return (
                  <td
                    key={beat}
                    className={"beat"}
                    onClick={event => {
                      event.preventDefault();
                      this.props.togglePaternBeat(beat);
                    }}
                  >
                    <br />
                    <a
                      href=""
                      onClick={event => {
                        event.preventDefault();
                        this.props.togglePaternBeat(beat);
                      }}
                    >
                      <div className={sequenceClass} />
                    </a>
                    <strong className={"SequenceNumbers"}>{beat + 1}</strong>
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default SequenceBar;
