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
        tracks.forEach(({name, volume, muted, note, beats}) => {
            if (beats[index]) {
                try {
                    keys
                        .get(name)
                        .start(time, 0, note, 0);
                    keys
                        .get(name).volume.value = muted
                            ? -Infinity
                            : volume;
                } catch(e) {}
            }
        });
    };
}