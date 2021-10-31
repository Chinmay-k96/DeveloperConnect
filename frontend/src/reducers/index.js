import { combineReducers } from 'redux';
// import alert from './alert';
// import auth from './auth';
// import profile from './profile';
// import post from './post';
import authReducer from './auth';
import profileReducer from './profile';
import postReducer from './post';

export default combineReducers({
    auth: authReducer,
    post: postReducer,
    profile: profileReducer
});