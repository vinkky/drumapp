/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { APIsaveItem, APIgetItems, unSubscribe, updateItem, deleteItem, renameItem } from '../../actions/tableActions';
import PatternSelector from './Components/SampleSelector';
import * as trackControls from './Controls/Trackcontrols';
import * as loopControls from './Controls/SequenceControls';
import CustomButton from './Components/CustomButton';
import SequenceBar from './Components/SequenceBar';
import TracksComponent from './Components/TracksComponent';
import OneShotComponent from './Components/OneshotComponent';
import NoiseComponent from './Components/NoiseComponent';
import EffectsComponent from './Components/EffectsComponent';
import PatternList from '../DashBoard/Tables/TableContainers/PatternList';
import { CircleSlider } from 'react-circle-slider';
import Slider, { Range } from 'rc-slider';

import List from '../DashBoard/Tables/TableComponents/PatternItem';

import Tables from '../DashBoard/Tables/TableContainers/Tables';

import Tone from 'tone';

import 'rc-slider/assets/index.css';
import './DrumMachine.css';

// setTimeout(() => {
//   audioScene();
// }, 0);

// function audioScene() {
//   ReactDOM.render(
//     <MusicBox  />,
//     document.getElementById("root")
//   );
// }

class MusicBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			bpm: 120,
			tracks: [
				{
					id: 1,
					name: 'kick-808',
					vol: 1,
					muted: false,
					note: '4n',
					beats: trackControls.initBeats(16),
					currPattern: 0,
					patterns: trackControls.initPatterns(4),
					switchMode: false,
					switchPatterns: trackControls.initSwitches(8)
				},
				{
					id: 2,
					name: 'clap-808',
					vol: 1,
					muted: false,
					note: '8n',
					beats: trackControls.initBeats(16),
					currPattern: 0,
					patterns: trackControls.initPatterns(4),
					switchMode: false,
					switchPatterns: trackControls.initSwitches(8)
				},
				{
					id: 3,
					name: 'snare-808',
					vol: 1,
					muted: false,
					note: '8n',
					beats: trackControls.initBeats(16),
					currPattern: 0,
					patterns: trackControls.initPatterns(4),
					switchMode: false,
					switchPatterns: trackControls.initSwitches(8)
				},
				{
					id: 4,
					name: 'hihat-808',
					vol: 1,
					muted: false,
					note: '16n',
					beats: trackControls.initBeats(16),
					currPattern: 0,
					patterns: trackControls.initPatterns(4),
					switchMode: false,
					switchPatterns: trackControls.initSwitches(8)
				},
				{
					id: 5,
					name: 'tom-808',
					vol: 1,
					muted: false,
					note: '8n',
					beats: trackControls.initBeats(16),
					currPattern: 0,
					patterns: trackControls.initPatterns(4),
					switchMode: false,
					switchPatterns: trackControls.initSwitches(8)
				}
			],
			selectedTrack: 0,
			currentBeat: -1,
			locked: false,
			patternMode: false,
			pattern: trackControls.initBeats(16),
			notes: [ '2n', '4n', '8n', '16n' ],
			masterVolume: 0,
			currentBar: 0,
			switchLengths: [ 16, 32 ],
			selectedLength: 0,
			i: 0,
			loading: true
		};

		// Init sequence
		this.loop = loopControls.create(this.state.tracks, this.updateCurrentBeat);
		loopControls.updateBPM(this.state.bpm);

		// Change maser volume
		Tone.Master.volume.value = this.state.masterVolume;

		this.handleKeyboardInput = this.handleKeyboardInput.bind(this); //bind function once
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyboardInput);
		this.props.APIgetItems();
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyboardInput);
	}

	componentDidUpdate(prevProps, prevState) {
		this.props.table.unSubscribe
			? window.removeEventListener('keydown', this.handleKeyboardInput)
			: window.addEventListener('keydown', this.handleKeyboardInput);
		// Object.entries(this.props).forEach(
		// 	([ key, val ]) => prevProps[key] !== val && console.log(`Prop '${key}' changed`)
		// );
		// Object.entries(this.state).forEach(
		// 	([ key, val ]) => prevState[key] !== val && console.log(`State '${key}' changed`)
		// );
	}

	handleKeyboardInput = (e) => {
		const code = e.keyCode ? e.keyCode : e.which;
		switch (code) {
			case 49:
				this.selectTrack(0);
				break;
			case 50:
				this.selectTrack(1);
				break;
			case 51:
				this.selectTrack(2);
				break;
			case 52:
				this.selectTrack(3);
				break;
			case 53:
				this.selectTrack(4);
				break;
			case 54:
				this.selectTrack(5);
				break;
			case 55:
				this.selectTrack(6);
				break;
			case 56:
				this.selectTrack(7);
				break;
			case 57:
				this.selectTrack(8);
				break;
			default:
				return false;
		}
	};

	changeTracks = (id) => {
		const pattern = this.props.table.patterns.filter((pattern) => pattern._id === id)[0].pattern;
		this.updateTracks(pattern);
	};

	// Pattern functionality
	updatePatternMode = () => {
		this.setState({ patternMode: !this.state.patternMode });
	};
	togglePaternBeat = (beat) => {
		const { pattern } = this.state;
		this.setState({
			pattern: pattern.map((v, i) => (i !== beat ? v : !v))
		});
	};
	addTrackPatern = (id, slotid) => {
		const { tracks, pattern } = this.state;
		this.setState({
			tracks: trackControls.addTrackPatern(tracks, id, slotid, pattern)
		});
	};
	changeTrackPattern = (id, patternID) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.changeTrackPattern(tracks, id, patternID));
	};
	toggleSwitchPattern = (id, i) => {
		const { tracks } = this.state;
		this.setState({ tracks: trackControls.toggleSwitchPattern(tracks, id, i) });
	};
	switchPatternMode = (id) => {
		const { tracks } = this.state;
		this.setState({ tracks: trackControls.switchPatternMode(tracks, id) });
	};
	switchTrackPattern = () => {
		const { tracks, currentBar } = this.state;
		tracks.forEach(({ id, switchMode, switchPatterns }) => {
			let patternID = switchPatterns[currentBar];
			let index = (currentBar - 1 + 8) % 8;
			if (switchMode && switchPatterns[index] !== switchPatterns[currentBar]) {
				this.changeTrackPattern(id, patternID);
			}
		});
	};
	changeSwitchLength = (id) => {
		this.setState({ selectedLength: id });
	};
	// Sequence functionality
	updateCurrentBeat = (beat) => {
		const { i, currentBar, currentBeat, switchLengths, selectedLength } = this.state;
		this.setState({ currentBeat: beat });
		if (currentBeat % 16 == 0) {
			this.setState({ currentBar: (currentBar + 1) % 8 });
			this.switchTrackPattern();
		}
		// if(this.state.currentBar == 8){
		//   this.setState({currentBar: 0});
		// }
	};
	changeMasterVolume = (volume) => {
		Tone.Master.volume.value = volume;
		return this.setState({ masterVolume: volume });
	};
	updateBPM = (newBpm) => {
		loopControls.updateBPM(newBpm);
		this.setState({ bpm: newBpm });
	};
	updateTracks = (newTracks) => {
		this.loop = loopControls.update(this.loop, newTracks, this.updateCurrentBeat);
		this.setState({ tracks: [ ...newTracks ] });
	};
	toggleTrackBeat = (id, beat) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.toggleTrackBeat(tracks, id, beat));
	};
	addTrack = () => {
		const { tracks } = this.state;
		if (tracks.length <= 8) {
			this.updateTracks(trackControls.addTrack(tracks));
		}
	};
	deleteTrack = (id) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.deleteTracks(tracks, id));
	};
	muteTrack = (id) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.muteTrack(tracks, id));
	};
	setTrackVolume = (id, vol) => {
		if (!this.state.locked) {
			this.setState({ locked: true });
			setTimeout(this.unlock, 301);
			const { tracks } = this.state;
			this.updateTracks(trackControls.setTrackVolume(tracks, id, vol));
		}
	};
	unlock = () => {
		this.setState({ locked: false });
	};
	updateTrackSample = (id, sample) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.updateTrackSample(tracks, id, sample));
	};
	updateTrackNote = (id, note) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.updateTrackNote(tracks, id, note));
	};
	clearTrack = (id) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.clearTrack(tracks, id));
	};
	updateTrackSample = (id, sample) => {
		const { tracks } = this.state;
		this.updateTracks(trackControls.updateTrackSample(tracks, id, sample));
	};
	selectTrack = (id) => {
		this.setState({ selectedTrack: id });
	};

	savePattern = (name) => {
		this.props.APIsaveItem(name, this.state.tracks);
	};

	updatePattern = (id) => {
		this.props.updateItem(id, this.state.tracks);
	};

	render() {
		return (
			<div className="main">
				<div className="left">
					<div className="tracks">
						<TracksComponent
							index={this.state.currentBeat}
							currentBar={this.state.currentBar}
							tracks={this.state.tracks}
							notes={this.state.notes}
							toggleTrackBeat={this.toggleTrackBeat}
							deleteTrack={this.deleteTrack}
							muteTrack={this.muteTrack}
							addTrackPatern={this.addTrackPatern}
							changeTrackPattern={this.changeTrackPattern}
							clearTrack={this.clearTrack}
							setTrackVolume={this.setTrackVolume}
							updateTrackSample={this.updateTrackSample}
							updateTrackNote={this.updateTrackNote}
							toggleSwitchPattern={this.toggleSwitchPattern}
							switchPatternMode={this.switchPatternMode}
							patternMode={this.state.patternMode}
							selectedTrack={this.state.selectedTrack}
						/>
					</div>
					<div className="sequence">
						<SequenceBar
							selectedTrack={this.state.selectedTrack}
							index={this.state.currentBeat}
							patternMode={this.state.patternMode}
							pattern={this.state.pattern}
							togglePaternBeat={this.togglePaternBeat}
							tracks={this.state.tracks}
							toggleTrackBeat={this.toggleTrackBeat}
						/>
					</div>
				</div>
				<div className="right">
					<div className="sideComponent">
						<PatternList
							patterns={this.props.table.patterns}
							changeTracks={this.changeTracks}
							unSubscribe={this.props.unSubscribe}
							updateItem={this.updatePattern}
							deleteItem={this.props.deleteItem}
							renameItem={this.props.renameItem}
							savePattern={this.savePattern}
						/>
						<div style={{ display: 'inline-block', width: '310px' }}>
							<CustomButton classID="PlayButton" source={this.loop} click={'Play'} unclick={'Stop'} />
							<button
								className="CustomBtn"
								style={
									this.state.patternMode ? (
										{ backgroundColor: '#283845' }
									) : (
										{ backgroundColor: '#B8B08D' }
									)
								}
								onClick={this.updatePatternMode}
							>
								PT MODE
							</button>
							<button
								className="CustomBtn"
								disabled={this.state.tracks.length >= 9}
								onClick={this.addTrack}
							>
								ADD CH
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	table: state.table
});

export default connect(mapStateToProps, { APIsaveItem, APIgetItems, unSubscribe, updateItem, deleteItem, renameItem })(
	MusicBox
);
