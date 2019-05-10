/* eslint-disable no-unused-vars */
import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const PatternItem = (props) => {
	return (
		<TableRow>
			<TableCell>{props.audioFile.name}</TableCell>
			<TableCell style={{ width: '50px', padding: '0px' }}>
				<IconButton aria-label="Delete" />
			</TableCell>
			<TableCell style={{ width: '50px', padding: '0px' }}>
				<IconButton aria-label="Delete">
					<SettingsIcon />
				</IconButton>
			</TableCell>
			<TableCell style={{ width: '50px', padding: '0px' }}>
				<IconButton aria-label="Delete" onClick={() => props.functions.deleteAudio(this.props.audioFile._id)}>
					<DeleteIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};

export default PatternItem;
