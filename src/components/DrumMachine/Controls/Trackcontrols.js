export function initBeats(n){
    return new Array(n).fill(false);
}

export function addTrack(tracks) {
    const id = Math.max.apply(null, tracks.map(t => t.id)) + 1;
    return [
        ...tracks, {
            id,
            name: "kick-electro01",
            volume: .8,
            muted: false,
            beats: initBeats(16),
        }
    ];
}

export function clearTrack(tracks, id) {
    return tracks.map((track) => {
        if (track.id !== id) {
            return track;
        } else {
            return {...track, beats: initBeats(16)};
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
                beats: track.beats.map((v, i) => i !== beat ? v : !v)
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

export function changeTrackPattern (tracks, id, patternID) {
    return tracks.map((track) => {
        if (track.id !== id) {
            return track;
        } else {
            return {...track, beats: track.patterns[patternID]};
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
export function updateTrackSample(tracks, id, sample) {
    return tracks.map((track) => {
        if (track.id !== id) {
            return track;
        } else {
            return {...track, name: sample};
        }
    });
}


