import Tone from "tone";

export function create(vol, dist, del, freq, bfreq, notes, type){
  const bass = new Tone.Pattern(
    loopProcessor(vol, dist, del, freq, bfreq, notes),
    notes,
    type
  );
  Tone.Transport.start(+1);
  return bass;
}

export function update(bass, vol, dist, del, freq, bfreq){
  bass.callback = loopProcessor(vol, dist, del, freq, bfreq);
  return bass;
}

function loopProcessor  (vol, dist, del, freq, bfreq) {
  let bassline = new Tone.FMSynth();
  let basslineVolume = new Tone.Volume(vol);
  let basslineDistortion = new Tone.Distortion(dist);
  let basslineDelay = new Tone.FeedbackDelay(del);
  let basslinePhaser = new Tone.Phaser({
    frequency: freq,
    depth: 15,
    baseFrequency: bfreq
  });
  bassline.chain(basslineDistortion, basslineDelay);
  bassline.chain(basslineDistortion, basslinePhaser);
  bassline.chain(basslinePhaser, basslineVolume);
  bassline.chain(basslineVolume, Tone.Master);
  return (time, note) => {
    bassline.triggerAttackRelease(note,  "8n", time);
  };
}