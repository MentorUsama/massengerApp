import * as actionTypes from './types';

export const setCurrentChannel=channel=>{
    return {
        type:actionTypes.SET_CURRENT_CHANNEL,
        payload:{currentChannel:channel}
    }
}

export const setPrivateChannel=channel=>{
    return {
        type:actionTypes.SET_PRIVATE_CHANNEL,
        payload:
        {
            isPrivateChannel:channel
        }
    }
}
export const setActiveChannel=userId=>{
    return {
        type:actionTypes.SET_ACTIVE_CHANNEL,
        payload:
        {
            activeChannel:userId
        }
    }
}


export const setUserPosts=(userPost)=>{
    return {
        type:actionTypes.SET_USER_POSTS,
        payload:{
            userPosts:userPost
        }
    }
}

export const setColors=(primaryColor,secondaryColor)=>{
    return {
        type:actionTypes.SET_COLORS,
        payload:{
            primaryColor,
            secondaryColor
        }
    }
}