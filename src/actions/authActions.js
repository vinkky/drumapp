import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { TEST_DISPATCH, SET_CURRENT_USER } from './types';

export const setCurrent = userToken => dispatch => {

  localStorage.setItem('jwtToken', userToken);
  setAuthToken(userToken);
  const decoded = jwt_decode(userToken);
  axios.get('http://localhost:5000/users/get/'+ decoded.sub)
    .then(res => {
       dispatch(setCurrentUser(res.data.user))
    })
    
};
export const setCurrentUser = (user) => {
  return {
    type: SET_CURRENT_USER,
    payload: user,
    
  };
};
// Register User
export const registeruser = (userData) => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  }
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};