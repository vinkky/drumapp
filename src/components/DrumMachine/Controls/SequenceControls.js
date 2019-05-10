import Tone from 'tone';

export function create(tracks, beatNotifier) {
	// to prevent buffer from crashing
	Tone.context.lookAhead = 0.1;
	const loop = new Tone.Sequence(loopProcessor(tracks, beatNotifier), [ ...new Array(16) ].map((_, i) => i), '16n');

	Tone.Transport.bpm.value = 120;
	//should prevent from buffer crashing maybe
	Tone.Transport.start('+0.1');
	return loop;
}
export function updateBPM(bpm) {
	Tone.Transport.bpm.value = bpm;
}

export function update(loop, tracks, beatNotifier) {
	loop.callback = loopProcessor(tracks, beatNotifier);
	return loop;
}
const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

function randomBetween(val, offset) {
	let max = val + offset;
	let min = val - offset;

	return Math.random() * (max - min) + min;
}

function loopProcessor(tracks, beatNotifier) {
	const urls = tracks.reduce((acc, { name }) => {
		return { ...acc, [name]: `http://localhost:3000/src/sounds/drums/${name}.[mp3|mp3]` };
	}, {});
	const keys = new Tone.Players(urls, {
		fadeOut: '64n'
	}).toMaster();
	return (time, index) => {
		beatNotifier(index);
		const start = async (index) => {
			await asyncForEach(tracks, async ({ name, vol, muted, note, beats }) => {
				if (beats[index]) {
					await waitFor(50);
					try {
						keys.get(name).start(time + 0.24, 0, note).volume.value = muted
							? -Infinity
							: randomBetween(vol, 2); //if buffer lags time+0.1
					} catch (e) {
						return e;
					}
				}
			});
		};
		start(index);
	};
}
