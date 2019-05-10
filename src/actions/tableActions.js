import axios from 'axios';
import { LOAD_ITEM, SAVE_ITEM, SET_ITEMS, SET_LOADING, SET_UNSUBSCRIBE } from './types';

export const APIsaveItem = (name, pattern) => (dispatch) => {
	axios
		.post('http://localhost:5000/patterns/create', { name, pattern })
		.then(() => {
			dispatch(APIgetItems());
		})
		.catch((err) => {});
};

export const APIgetItems = () => {
	return (dispatch) => {
		dispatch(setLoading(true));
		axios.get('http://localhost:5000/patterns/getAll').then((res) => {
			dispatch(setItems(res.data), setLoading(false));
		});
	};
};

export const renameItem = (id, name) => (dispatch) => {
	dispatch(setLoading(true));
	axios
		.post('http://localhost:5000/patterns/rename', { id, name })
		.then(() => {
			dispatch(APIgetItems());
		})
		.catch((err) => {});
};

export const deleteItem = (id) => (dispatch) => {
	dispatch(setLoading(true));
	console.log('dasdsa', id);
	axios
		.post('http://localhost:5000/patterns/delete', { id })
		.then(() => {
			dispatch(APIgetItems());
		})
		.catch((err) => {});
};

export const updateItem = (id, pattern) => (dispatch) => {
	dispatch(setLoading(true));
	console.log('dasdsa', id);
	axios
		.post('http://localhost:5000/patterns/update', { id, pattern })
		.then(() => {
			dispatch(APIgetItems());
		})
		.catch((err) => {});
};

export const setItems = (items) => {
	return {
		type: SET_ITEMS,
		payload: items
	};
};

export const loadItem = (item) => {
	return {
		type: LOAD_ITEM,
		payload: item
	};
};

export const saveItem = (item) => {
	return {
		type: SAVE_ITEM,
		payload: item
	};
};

export const setLoading = (loading) => {
	return {
		type: SET_LOADING,
		payload: loading
	};
};

export const unSubscribe = (condition) => {
	return {
		type: SET_UNSUBSCRIBE,
		payload: condition
	};
};
