import {combineReducers} from 'redux';
import user from './user_reducers';
// import chatRoom from './chatRoom_reducer';

const rootReducer = combineReducers({
    user,
    // chatRoom
})

export default rootReducer