import React,{useState,useEffect} from 'react'
import { Icon,MenuItem, MenuMenu} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';
import firebase from "../../../../firebase/firebase";
import { filter } from 'minimatch';

function Stared(props) {
    const [starredChannels,setStarredChannels]=useState([]);
    const [userRef]=useState(firebase.database().ref("users"));
    console.log("Starred",starredChannels);

    useEffect(() => {
        if(props.user)
        {
            addListner(props.user.uid);
        }
        return ()=>{
            removveListers();
        }
    },[])
    const addListner=(userId)=>{
        let StarredChannel=[];
        userRef.child(userId).child('starred').on('child_added',snap=>{
            const sc={id:snap.key,...snap.val()}
            StarredChannel.push(sc);
            setStarredChannels([...StarredChannel]);
        })

        userRef.child(userId).child('starred').on('child_removed',snap=>{
            const channelToRemove={id:snap.key,...snap.val()}
            const filteredChannel=StarredChannel.filter(channel=>{
                return channel.id!==channelToRemove.id;
            })
            StarredChannel=filteredChannel;
            setStarredChannels(filteredChannel);
        })
    }
    const removveListers=()=>{
        userRef.child(`${props.user.uid}/starred`).off()
    }
    const changeChannel=(channel)=>{
        props.dispatchCurrentChannel(channel);
        props.dispatchPrivateChannel(false);
        props.dispatchActiveChannel(channel.id);
        // setChannel(channel);
    }
    const displayChannel = () =>
    starredChannels.length > 0 &&
    starredChannels.map(channel => (
        <MenuItem
            key={channel.id}
            onClick={() => changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={channel.id===props.activeChannel}

        >
            # {channel.name}
        </MenuItem>
));

    return (
        <MenuMenu  className="menu">
        <MenuItem>
            <span>
                <Icon name="star" /> STARED
            </span>{""}
            ({starredChannels.length})
        </MenuItem>
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
        dispatchActiveChannel:(userID)=>dispatch(actions.setActiveChannel(userID))
    }
}
export default connect(mapStateToProps,mapDispatchProps)(Stared);
