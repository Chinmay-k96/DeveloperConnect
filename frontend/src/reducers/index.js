import { combineReducers } from 'redux';
// import alert from './alert';
// import auth from './auth';
// import profile from './profile';
// import post from './post';
import authReducer from './auth';
import profileReducer from './profile';

export default combineReducers({
    auth: authReducer,
//   alert,
//   auth,
    profile: profileReducer
//   post
});