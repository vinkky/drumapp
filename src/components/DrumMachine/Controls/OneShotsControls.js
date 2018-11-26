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