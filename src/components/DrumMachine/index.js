/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import * as trackControls from './Controls/Trackcontrols';
import * as loopControls from './Controls/SequenceControls';
import CustomButton from './Components/CustomButton';
import SequenceBar from './Components/SequenceBar';
import TracksComponent from './Components/TracksComponent';
import OneShotComponent from './Components/OneshotComponent';
import NoiseComponent from './Components/NoiseComponent';
import EffectsComponent from './Components/EffectsComponent';
import AutomationComponent from './Components/AutomationComponent';
import { CircleSlider } from 'react-circle-slider';
import Slider, { Range } from 'rc-slider';
import MusicBox from './DrumMachine';
import Tables from '../DashBoard/Tables/TableContainers/Tables';

import Tone from 'tone';

import 'rc-slider/assets/index.css';
import './DrumMachine.css';

class DrumMachine extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			bpm: 120,
			masterVolume: 0
		};

		// Init sequence
		loopControls.updateBPM(this.state.bpm);

		Tone.Transport.swing = 0.5;
		Tone.Transport.swingSubdivision = '8n';

		// Change maser volume
		Tone.Master.volume.value = this.state.masterVolume;

		// Recording functionality
		this.audio = React.createRef();
		this.myRef = React.createRef();
		const actx = Tone.context;
		const dest = actx.createMediaStreamDestination();
		this.recorder = new MediaRecorder(dest.stream);
		Tone.Master.connect(dest);
		this.chunks = [];

		this.recorder.ondataavailable = (evt) => this.chunks.push(evt.data);
		this.recorder.onstop = (evt) => {
			let blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' });
			this.audio.current.src = URL.createObjectURL(blob);
			this.myRef.current.href = URL.createObjectURL(blob);
			this.chunks = [];
		};
	}

	updateBPM = (newBpm) => {
		loopControls.updateBPM(newBpm);
		this.setState({ bpm: newBpm });
	};
	changeMasterVolume = (volume) => {
		Tone.Master.volume.value = volume;
		return this.setState({ masterVolume: volume });
	};

	render() {
		return (
			<div className="wrapper">
				<div className="flex-grid-thirds">
					<div className="col">
						{' '}
						<NoiseComponent />
					</div>
					<div className="col">
						<EffectsComponent />
					</div>
					<div className="col">{/* <AutomationComponent /> */}</div>
					<div className="col audio">
						<div className="AudioPlayer">
							<audio ref={this.audio} controls controlsList="nodownload" autostart="0" />
						</div>
						<CustomButton source={this.recorder} classID="RecordBtn" click={'Record'} unclick={'Stop'} />
						<a className="RecordBtn" ref={this.myRef} href="" download>
							<button class="RecordBtn">Download</button>
						</a>
						<div className="mainOptions">
							<div style={{ float: 'left', width: 60 }}>
								<h1>VOL </h1>
							</div>
							<div style={{ float: 'left', marginLeft: 15 }}>
								<CircleSlider
									className={'CircleKnob'}
									circleColor={'#283845'}
									progressColor={'#B8B08D'}
									knobColor={'#B8B08D'}
									value={this.state.masterVolume}
									min={-50}
									max={12}
									size={50}
									knobRadius={5}
									circleWidth={2}
									progressWidth={4}
									onChange={(value) => this.changeMasterVolume(parseFloat(value))}
								/>
							</div>
							<div className="box">
								<h1 className="inside">{this.state.masterVolume}</h1>
							</div>
						</div>
						<div className="mainOptions">
							<div style={{ float: 'left', width: 60 }}>
								<h1>BPM</h1>
							</div>
							<div style={{ float: 'left', marginLeft: 15 }}>
								<CircleSlider
									className={'CircleKnob'}
									circleColor={'#283845'}
									progressColor={'#B8B08D'}
									knobColor={'#B8B08D'}
									value={this.state.bpm}
									min={30}
									max={240}
									size={50}
									knobRadius={5}
									circleWidth={2}
									progressWidth={4}
									onChange={(value) => this.updateBPM(parseFloat(value))}
								/>
							</div>
							<div className="box">
								<h1 className="inside">{this.state.bpm}</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="main">
						<div className="tracks">
							<OneShotComponent />
							<MusicBox />
						</div>
					</div>
				</div>
				{/* <Tables /> */}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, {})(DrumMachine);
