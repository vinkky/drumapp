import Tone from "tone";

export function create(tracks, beatNotifier){
  // to prevent buffer from crashing
  Tone.context.lookAhead = 0.1;
  const loop = new Tone.Sequence(
    loopProcessor(tracks, beatNotifier),
    [...new Array(16)].map((_, i) => i),
    "16n"
  );
    
  Tone.Transport.bpm.value = 120;
  //should prevent from buffer crashing maybe
  Tone.Transport.start("+0.1");
  return loop;
}
export function updateBPM(bpm) {
  Tone.Transport.bpm.value = bpm;
}

export function update(loop, tracks, beatNotifier){
  loop.callback = loopProcessor(tracks, beatNotifier);
  return loop;
}

function loopProcessor  (tracks, beatNotifier) {
  const urls = tracks.reduce((acc, {name}) => {
    return {...acc, [name]: `http://localhost:3000/src/sounds/drums/${name}.[mp3|mp3]`};
  }, {});
  const keys = new Tone.Players(urls, {
    fadeOut: "64n"
  }).toMaster();
  return (time, index) => {
    beatNotifier(index);
    tracks.forEach(({name, vol, muted, note, beats}) => {
      if (beats[index]) {
        try {
          keys
            .get(name)
            .start(time+0.24, 0, note, ) //if buffer lags time+0.1
            .volume.value = muted
              ? -Infinity
              : vol;
        } catch(e) {
          return e;
        }
      }
    });
  };
}