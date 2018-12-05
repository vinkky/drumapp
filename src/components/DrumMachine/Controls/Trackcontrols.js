export function initBeats(n){
  return new Array(n).fill(false);
}
export function initSwitches(n){
  return new Array(n).fill(0);
}
export function initPatterns(n) {
  return new Array(n).fill(Array(16).fill(false));
}
export function addTrack(tracks) {
  const id = Math.max.apply(null, tracks.map(t => t.id)) + 1;
  return [
    ...tracks, {
      id,
      name: "kick-electro01",
      volume: .8,
      muted: false,
      note: "16n",
      beats: initBeats(16),
      currPattern: 0,
      patterns: initPatterns(4),
      switchMoode: false,
      switchPatterns: initSwitches(8)
    }
  ];
}

export function clearTrack(tracks, id) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, beats: initBeats(16), 
        patterns: track.patterns.map((v, i) => i == track.currPattern ? initBeats(16) : v ) 
      };
    }
  });
}

export function deleteTracks(tracks, id) {
  return tracks.filter((track) => track.id !== id);
}

export function toggleTrackBeat(tracks, id, beat) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {
        ...track,
        beats: track.beats.map((v, i) => i !== beat ? v : !v), 
        patterns: track.patterns.map((v, i) => i == track.currPattern ? v.map((v, i) => i !== beat ? v : !v) : v), 
      };
    }
  });
}

export function setTrackVolume(tracks, id, vol) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, vol};
    }
  });
}

export function muteTrack(tracks, id) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, muted: !track.muted};
    }
  });
}

export function updateTrackNote(tracks, id, note) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, note: note};
    }
  });
}

export function changeTrackPattern (tracks, id, patternID) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, beats: track.patterns[patternID], currPattern: patternID};
    }
  });
}

export function addTrackPatern (tracks, id, slotid, pattern) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, 
        patterns: track.patterns.map((item, index) => index == slotid ? pattern : item )
      }; 
    }
  });
}

export function deleteTrackPattern (tracks, id, patternID) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, 
        patterns: track.patterns.splice(patternID, 1)};
    }
  });
}


export function toggleSwitchPattern (tracks, id, switchID) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, 
        switchPatterns: track.switchPatterns.map((v, i) => i == switchID ? (v + 1) % 4 : v),
      };
    }
  });
}

export function switchPatternMode (tracks, id) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, 
        switchMode: !track.switchMode
      };
    }
  });
}

export function addSwitchPattern (tracks, id, switchID) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, 
        switchArr: track.switchArr.concat(switchID)
      };
    }
  });
}

export function updateTrackSample(tracks, id, sample) {
  return tracks.map((track) => {
    if (track.id !== id) {
      return track;
    } else {
      return {...track, name: sample};
    }
  });
}


