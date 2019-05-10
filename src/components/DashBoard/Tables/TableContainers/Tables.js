/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import FormData from 'form-data';
import axios from 'axios';
import Table from './Table';
import { APIgetItems } from '../../../../actions/tableActions';
import AudioItem from '../TableComponents/AudioItem';
import PatternItem from '../TableComponents/PatternItem';
import SearchWidget from '../SearchWidget';

class Tables extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			audioFiles: [],
			filteredFiles: [],
			records: [],
			patterns: [],
			loadingSounds: true,
			loadingPatterns: true,
			error: ''
		};
	}

	componentDidMount() {
		this.fetchFiles();
		this.fetchPatterns();
	}

	fetchFiles = () => {
		console.log('fetch files suveike');
		axios
			.get('http://localhost:5000/tracks')
			.then((response) => {
				this.setState({ audioFiles: response.data, loadingSounds: false, filteredFiles: response.data }); //.sort((a, b) => (a.filename < b.filename ? -1 : 1))
				console.log(this.state.audioFiles);
			})
			.catch((error) => {
				this.setState({ error: error });
			});
	};

	fetchPatterns = () => {
		this.setState({ loadingPatterns: true });
		this.props.APIgetItems();
		this.setState({ loadingPatterns: false });
	};

	deleteAudio = (id) => {
		console.log(id);
		axios
			.delete(`http://localhost:5000/tracks/${id}`)
			.then((response) => {
				this.fetchFiles();
			})
			.catch((error) => {});
	};

	onFileChange = (e) => {
		let files = e.target.files || e.dataTransfer.files;
		if (!files.length) {
			console.log('no files');
		}
		const form = new FormData();

		for (var i = 0; i < files.length; i++) {
			let file = files.item(i);
			form.append('track', file);
		}
		const config = {
			headers: { 'content-type': 'multipart/form-data' }
		};
		return axios
			.post('http://localhost:5000/tracks/uploads', form, config)
			.then((response) => {
				this.fetchFiles();
			})
			.catch((error) => {});
	};

	filterList = (event) => {
		var filteredFiles = this.state.audioFiles;
		filteredFiles = filteredFiles.filter((item) => {
			return item.filename.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
		});
		this.setState({ filteredFiles });
		console.log('veikia');
	};

	render() {
		return (
			<div>
				<SearchWidget onChange={this.filterList} />
				<input id="my-file-selector" multiple type="file" name="track" onChange={this.onFileChange} />
				<div>
					{this.state.loadingSounds ? (
						<div />
					) : (
						<Table items={this.state.filteredFiles} deleteAudio={this.deleteAudio}>
							<AudioItem />
						</Table>
					)}
					{this.props.table.loading ? (
						<div />
					) : (
						<Table items={this.props.table.patterns} deleteAudio={this.deleteAudio}>
							<PatternItem />
						</Table>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	table: state.table
});

export default connect(mapStateToProps, { APIgetItems })(Tables);
