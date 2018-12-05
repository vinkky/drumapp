import Tone from "tone";

export function create(oneShots){
  const oneShotPlayer = new Tone.Players(
    playerMaker(oneShots),
    {
      fadeOut: "64n"
    }
  ).toMaster();

  return oneShotPlayer;
}
export function update(oneShotPlayer, oneShots){
  oneShotPlayer = create(oneShots);
  return oneShotPlayer;
}

function playerMaker  (oneShots) {
  const urls = oneShots.reduce((acc, {name}) => {
    return {...acc, [name]: `http://localhost:3000/src/sounds/loops/${name}.[mp3|mp3]`};
  }, {});
  return urls;
}


export function changeKeycode(oneShots, id, keyCode) {
  return oneShots.map((oneShot) => {
    if (oneShot.id !== id) {
      return oneShot;
    } else {
      return {...oneShot, keyCode: keyCode};
    }
  });
}

export function switchKeyEdit(oneShots, id, bool) {
  return oneShots.map((oneShot) => {
    if (oneShot.id !== id) {
      return oneShot;
    } else {
      return {...oneShot, keyEdit: bool};
    }
  });
}

export function loopShot(oneShots, id) {
  return oneShots.map((oneShot) => {
    if (oneShot.id !== id) {
      return oneShot;
    } else {
      return {...oneShot, loop: !oneShot.loop};
    }
  });
}

export function updateShotName(oneShots, id, sample) {
  return oneShots.map((oneShot) => {
    if (oneShot.id !== id) {
      return oneShot;
    } else {
      return {...oneShot, name: sample};
    }
  });
}

export function changeVolume(oneShots, id, vol) {
  return oneShots.map((oneShot) => {
    if (oneShot.id !== id) {
      return oneShot;
    } else {
      return {...oneShot, vol};
    }
  });
}

export function getSampleByID(oneShots, id) {
  return oneShots.find(obj => {
    return obj.id === id;
  }).name;
}