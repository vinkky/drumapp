import React from 'react';

class PlayButton extends React.Component {
	state = {
		isPlaying: false
	};

	onClick = () => {
		const isPlaying = !this.state.isPlaying;
		this.setState({ isPlaying });
		if (isPlaying) {
			this.props.source.start();
		} else {
			this.props.source.stop();
		}
	};

	render() {
		return (
			<button className={this.props.classID} onClick={this.onClick}>
				{this.state.isPlaying ? this.props.unclick : this.props.click}
			</button>
		);
	}
}

export default PlayButton;
