/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = (theme) => ({
	root: {
		width: '100%',
		maxWidth: 300,
		backgroundColor: 'D3D3D3',
		position: 'relative',
		overflow: 'auto',
		maxHeight: 140
	},
	input: {
		maxWidth: 200
	},
	listSection: {
		backgroundColor: 'inherit'
	},
	ul: {
		backgroundColor: 'inherit',
		padding: 0,
		margin: 0
	},
	item: {
		margin: 0,
		padding: 1,
		fontSize: 2
	},
	curritem: {
		margin: 0,
		padding: 1,
		fontSize: 2,
		backgroundColor: 'rgb(242, 149, 89, 0.8)'
	}
});

class SelectedListItem extends React.Component {
	state = {
		open: false,
		selectedPattern: { name: '' },
		name: '',
		currentLoaded: ' ',
		nameToChange: '',
		isRename: false
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	loadPattern = (current) => {
		this.setState({ currentLoaded: current });
	};

	renamePattern = () => {
		this.setState((state) => ({ isRename: !state.isRename }));
	};

	handleListItemClick = (event, index) => {
		this.setState({ selectedPattern: index, nameToChange: index.name });
	};

	render() {
		const { classes, patterns } = this.props;
		const pattern = this.state.selectedPattern;
		return (
			<div
				style={{
					backgroundColor: '#747474',
					border: '2px solid #c3c3c3',
					borderRadius: '4px',
					width: '300px',
					height: '220px',
					paddingLeft: '4px',
					paddingRight: '4px'
				}}
			>
				<h5 style={{ textAlign: 'center', margin: '0px auto' }}>Patterns</h5>
				<Input
					onFocus={() => this.props.unSubscribe(true)}
					onBlur={() => this.props.unSubscribe(false)}
					onChange={this.handleChange}
					placeholder="Enter pattern name"
					value={this.state.name}
					name="name"
					className={classes.input}
					inputProps={{
						'aria-label': 'Description'
					}}
				/>
				<List className={classes.root} subheader={<li />}>
					<ul className={classes.ul}>
						{patterns.map((item, index) => (
							<ListItem
								button
								key={item.name}
								className={classes.item}
								selected={this.state.selectedPattern.name === item.name}
								onClick={(event) => this.handleListItemClick(event, item)}
							>
								{this.state.isRename && this.state.selectedPattern.name === item.name ? (
									<Input
										onFocus={() => this.props.unSubscribe(true)}
										onBlur={() => this.props.unSubscribe(false)}
										onChange={this.handleChange}
										placeholder="Placeholder"
										value={this.state.nameToChange}
										name="nameToChange"
										className={classes.input}
										inputProps={{
											'aria-label': 'Description'
										}}
									/>
								) : (
									<ListItemText
										primary={item.name}
										className={
											this.state.currentLoaded === item._id ? classes.curritem : classes.item
										}
									/>
								)}
							</ListItem>
						))}
					</ul>
				</List>
				<button className="PatternsBtn" onClick={() => this.props.savePattern(this.state.name)}>
					Save
				</button>
				<button
					className="PatternsBtn"
					onClick={() => {
						this.loadPattern(pattern._id);
						this.props.changeTracks(pattern._id);
					}}
				>
					Load
				</button>
				{this.state.isRename ? (
					<button
						className="PatternsBtn"
						onClick={() => {
							this.props.renameItem(pattern._id, this.state.nameToChange), this.renamePattern();
						}}
					>
						Save
					</button>
				) : (
					<button className="PatternsBtn" onClick={() => this.renamePattern()}>
						Rename
					</button>
				)}
				<button className="PatternsBtn" onClick={() => this.props.updateItem(pattern._id)}>
					Upd
				</button>
				<button className="PatternsBtn" onClick={() => this.props.deleteItem(pattern._id)}>
					Del
				</button>
			</div>
		);
	}
}

SelectedListItem.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SelectedListItem);
