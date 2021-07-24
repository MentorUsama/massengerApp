import * as actionTypes from '../actions/types';
const initialState = {
    currentChannel:null,
    isPrivateChannel:false,
    activeChannel:'',
    userPosts:null,
    primaryColor:"#4c3c4c",
    secondaryColor:"#eee"
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_CHANNEL:
            return { 
                ...state,
                currentChannel:action.payload.currentChannel
            }
        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel:action.payload.isPrivateChannel
            }
        case actionTypes.SET_ACTIVE_CHANNEL:
            return {
                ...state,
                activeChannel:action.payload.activeChannel
            }
        case actionTypes.SET_USER_POSTS:
            return {
                ...state,
                userPosts:action.payload.userPosts
            }
        case actionTypes.SET_COLORS:
            return {
                ...state,
                primaryColor:action.payload.primaryColor,
                secondaryColor:action.payload.secondaryColor
            }
        default:
            return state
    }
}
export default reducer;