import React from "react";
import Tone from "tone";


export function initRecording () {
  this.audio = React.createRef();
  this.myRef = React.createRef();
  const actx  = Tone.context;
  const dest  = actx.createMediaStreamDestination();
  this.recorder = new MediaRecorder(dest.stream);
  Tone.Master.connect(dest);
  const chunks = [];
  this.recorder.ondataavailable = evt => chunks.push(evt.data);
  this.recorder.onstop = evt => {
    let blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    this.audio.current.src = URL.createObjectURL(blob);
    this.myRef.current.href =  URL.createObjectURL(blob);
  };
}