/* eslint-disable no-unused-vars */
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import PlayIcon from '@material-ui/icons/playarrow';
import PauseIcon from '@material-ui/icons/pause';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

class AudioItem extends React.Component {
	constructor(props) {
		super(props);
		this.audio = new Audio();
		this.state = {
			playing: false
		};
		this.audio.src = `http://localhost:5000/tracks/${this.props.audioFile.filename}`;
	}

	componentWillMount() {
		this.audio.addEventListener(
			'ended',
			(e) => {
				this.setState({ playing: false });
			},
			false
		);
	}
	componentWillUnmount() {
		this.pauseSong();
	}

	playSong = () => {
		this.setState({ playing: true });
		this.audio.play();
	};

	pauseSong = () => {
		this.setState({ playing: false });
		this.audio.pause();
	};

	togglePause = () => {
		if (this.audio.paused) {
			this.playSong();
		} else {
			this.pauseSong();
		}
	};

	render() {
		return (
			<TableRow>
				<TableCell>{this.props.audioFile.filename}</TableCell>
				<TableCell style={{ width: '50px', padding: '0px' }}>
					<IconButton aria-label="Delete">
						{!this.state.playing ? (
							<PlayIcon onClick={() => this.togglePause(this.props.audioFile.filename)} />
						) : (
							<PauseIcon onClick={() => this.togglePause()} />
						)}
					</IconButton>
				</TableCell>
				<TableCell style={{ width: '50px', padding: '0px' }}>
					<IconButton aria-label="Delete">
						<SettingsIcon />
					</IconButton>
				</TableCell>
				<TableCell style={{ width: '50px', padding: '0px' }}>
					<IconButton
						aria-label="Delete"
						onClick={() => this.props.functions.deleteAudio(this.props.audioFile._id)}
					>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
		);
	}
}

export default AudioItem;
