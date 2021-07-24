import React ,{useState,useEffect,useCallback} from 'react'
import { MenuItem, MenuMenu, Icon } from 'semantic-ui-react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';
function DirectMessage(props) {



    // ======================== useState ===========================================
    const [user,setUser]=useState(props.user);
    const [users,setUsers]=useState([]);
    const [userRef]=useState(firebase.database().ref('users'))
    const [presenceRef]=useState(firebase.database().ref("presence"))
    const [connectedRef]=useState(firebase.database().ref('.info/connected'))



    // ======================== useEffect to add listeners =========================
    const addStatusToUser=(userId,connected=true,loadedUsers)=>{
        let updatedUser=loadedUsers.reduce((acc,user)=>{
            if(user.uid===userId)
            {
                user['status']=`${connected ? "online" : "offline"}`;
            }
            return acc.concat(user);
        },[])
        setUsers(updatedUser);
    }
    const addListeners=useCallback(
        // Start of function
        (currentUserUid)=>
        {
            // To check if the new user is added or not
            let loadedUser=[];
            userRef.on("child_added",(snap)=>{
                if(currentUserUid!=snap.key)
                {
                    let user=snap.val();
                    user['uid']=snap.key;
                    user['status']='offline';
                    loadedUser.push(user);
                    let newLoadedUser=[...loadedUser];
                    setUsers(newLoadedUser);
                }
            })
            // Run only if the current user connection change
            connectedRef.on('value',snap=>{
                if(snap.val()===true)
                {
                    const connectRef=presenceRef.child(currentUserUid);
                    connectRef.set(true);
                    connectRef.onDisconnect().remove(err=>{
                        if(err!=null)
                        {
                            console.log(err);
                        }
                    })
                }
            })
            // If new user added to the presence
            presenceRef.on("child_added",snap=>{
                if(currentUserUid!==snap.key)
                {
                    addStatusToUser(snap.key,true,loadedUser);
                }
            })
            // If new user removed to the presence
            presenceRef.on("child_removed",snap=>{
                if(currentUserUid!==snap.key)
                {
                    addStatusToUser(snap.key,false,loadedUser);
                }
            })
        } // End of function
        ,[]
    )
    useEffect(() => {
        if(user)
        {
            addListeners(user.uid);
        }
     },[addListeners])
    const removeListeners=()=>{
        userRef.off();
    }
     useEffect(() => {
         return () => {
             removeListeners();
         }
     }, [])


 
    // ================================= Other Functions
    const isUserOnline=(user)=>{
        return user.status==="online"
    }

    const userDate=()=>{
        if(users.length!==0)
        {
            return  users.map((user)=>(
                <MenuItem
                    key={user.uid}
                    onClick={()=>changeChannel(user)}
                    style={{opacity:0.7,fontStyle:'italic'}}
                    active={user.uid===props.activeChannel}
                >
                    <Icon 
                        name="circle" 
                        color={isUserOnline(user)?"green":"red"}
                    />
                        @ {user.name}
                </MenuItem>  
            ))
        }
        else
        {
            return null;
        }
    }
    const getChanneId=(userID)=>{
        const currentId=user.uid;
        return userID<currentId ?   `${userID}/${currentId}`:`${currentId}/${userID}`;
    }
    const changeChannel=(user)=>{
        const channelId=getChanneId(user.uid);
        const channelData={
            id:channelId,
            name:user.name,
        }
        props.setCurrent(channelData);
        props.setPrivate(true);
        props.dispatchActiveChannel(user.uid);
    }



    return (
        <MenuMenu>
            <MenuItem>
                <span>
                    <Icon name="mail" /> Direct Messages
                </span>
                {' '}
                ({users.length})
            </MenuItem>
            {
                userDate()
            }
        </MenuMenu>
    )
}



const mapStateToProps=state =>{
    return{
        activeChannel:state.currentChannel.activeChannel
    };
}
const mapDispatchProps=dispatch=>{
    return {
        setCurrent:(channel)=>dispatch(actions.setCurrentChannel(channel)),
        setPrivate:(channel)=>dispatch(actions.setPrivateChannel(channel)),
        dispatchActiveChannel:(userID)=>dispatch(actions.setActiveChannel(userID))
    }
  }
export default connect(mapStateToProps,mapDispatchProps)(DirectMessage);