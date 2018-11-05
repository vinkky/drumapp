import Tone from "tone";

export  function create(tracks, beatNotifier){
    const loop = new Tone.Sequence(
        loopProcessor(tracks, beatNotifier),
        [...new Array(16)].map((_, i) => i),
        "16n"
    );
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();
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
        return {...acc, [name]: `http://localhost:3000/src/sounds/${name}.[wav|wav]`};
    }, {});
    const keys = new Tone.Players(urls,       {
        fadeOut: "64n"
    }).toMaster();


    
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
                    var vel = Math.random() * 0.5 + 0.5;
                    keys
                        .get(name)
                        .start(time, 0, note, 0, vel);
                    keys
                        .get(name).volume.value = muted
                            ? -Infinity
                            : vol;
                } catch(e) {
                    console.log("kakzas vyksta", e);
                }
            }
        });
    };
}