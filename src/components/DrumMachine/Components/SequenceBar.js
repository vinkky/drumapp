// eslint-disable-next-line no-unused-vars
import React from "react";

const SequenceBar = (props) =>  {

  return (
    <table>
      <tbody>
        {!props.patternMode ? (
          props.tracks.map((track, i) => {
            return (
              <tr key={i} className="track">
                {i === props.selectedTrack
                  ? track.beats.map((v, beat) => {
                    const sequenceClass =
                          v && beat === props.index
                            ? "circleIndicator"
                            : v
                              ? "currentBeat circleIndicator"
                              : beat === props.index
                                ? "currentBeat circleIndicator"
                                : "circleIndicator";
                    return (
                      <td
                        key={beat}
                        className={"beat"}
                        onClick={event => {
                          event.preventDefault();
                          props.toggleTrackBeat(track.id, beat);
                        }}
                      >
                        <br />
                        <a
                          href=""
                          onClick={event => {
                            event.preventDefault();
                            props.toggleTrackBeat(track.id, beat);
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
            {props.pattern.map((v, beat) => {
              const sequenceClass =
                  v && beat === props.index
                    ? "circleIndicator"
                    : v
                      ? "currentBeat circleIndicator"
                      : beat === props.index
                        ? "currentBeat circleIndicator"
                        : "circleIndicator";
              return (
                <td
                  key={beat}
                  className={"beat"}
                  onClick={event => {
                    event.preventDefault();
                    props.togglePaternBeat(beat);
                  }}
                >
                  <br />
                  <a
                    href=""
                    onClick={event => {
                      event.preventDefault();
                      props.togglePaternBeat(beat);
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
  
};

export default SequenceBar;
