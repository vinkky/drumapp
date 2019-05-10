import { LOAD_ITEM, SAVE_ITEM, SET_ITEMS, SET_LOADING, SET_UNSUBSCRIBE } from '../actions/types';

const initialState = {
	patterns: [],
	savedItem: {},
	uploadedItem: {},
	loading: true,
	unSubscribe: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case LOAD_ITEM:
			return {
				...state,
				savedItem: action.payload
			};
		case SAVE_ITEM:
			return {
				...state,
				uploadedItem: action.payload
			};
		case SET_ITEMS:
			return {
				...state,
				patterns: action.payload
			};
		case SET_LOADING:
			return {
				...state,
				loading: action.payload
			};
		case SET_UNSUBSCRIBE:
			return {
				...state,
				unSubscribe: action.payload
			};
		default:
			return state;
	}
}
