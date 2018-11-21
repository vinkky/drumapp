import Tone from "tone";

export  function create(tracks, beatNotifier){
    // to prevent buffer from crashing
    // Tone.context.lookAhead = 0.3;
    const loop = new Tone.Sequence(
        loopProcessor(tracks, beatNotifier),
        [...new Array(16)].map((_, i) => i),
        "16n"
    );
    
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start(+1);
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
    var dist = new Tone.Distortion(0).toMaster();
    const urls = tracks.reduce((acc, {name}) => {
        return {...acc, [name]: `http://localhost:3000/src/sounds/${name}.[wav|wav]`};
    }, {});
    const keys = new Tone.Players(urls, {
        fadeOut: "64n"
    }).connect(dist, Tone.Master);
    function loaded() {
    }
    keys.callback = loaded();
    return (time, index) => {
        beatNotifier(index);
        // for (let y = 0; y < noteNames.length; y++) {
        //     if (tracks[y].beats[index]) {
        //         keys.get(noteNames[y]).start(time, 0, tracks[y].note, 0);
        //         keys
        //             .get(noteNames[y]).volume.value = tracks[y].muted
        //                 ? -Infinity
        //                 :  tracks[y].vol;
        //     }
        // }

        tracks.forEach(({name, vol, muted, note, beats}) => {
            if (beats[index]) {
                try {
                    keys
                        .get(name)
                        .start(time, 0, note, )
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