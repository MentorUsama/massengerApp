import { combineReducers } from 'redux';
// Importing Reducers
import userReducer from './userReducer';
import channelReducer from './channelReducer';
// Combining the reducers
const rootReducer=combineReducers({
    user:userReducer,
    currentChannel:channelReducer
})
// Exporting the combined reducer
export default rootReducer;