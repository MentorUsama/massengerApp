import React,{Fragment, useState,useEffect} from 'react';
import { Button, Form, FormField, Icon,Input,Label,LabelDetail,MenuItem, MenuMenu, Modal, ModalActions, ModalContent, ModalHeader } from 'semantic-ui-react';
import firebase from './../../../../firebase/firebase';
import { connect } from 'react-redux';
import * as actions from '../../../../store/actions/index';





function UserChannel(props) {


    // ===== Use States =====
    const {user}=props;
    const [channels,setChannels]=useState([]);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({
        channelName:'',
        channelDetails:''
    })
    const [userDetail]=useState(user);
    const [notifications,setnotifications]=useState([]);
    const [messageRef]=useState(firebase.database().ref("messages"))
    const [channelRef]=useState(firebase.database().ref("channels"));
    const [firstLoad,setFirstLoad]=useState(true);
    const [typingRef]=useState(firebase.database().ref("typing"));

    console.log("render");
    // ===== Function: Form Modal =====
    const closeModal=()=>{
        setModal(false);
    }
    const openModal=()=>{
        setModal(true);
    }
    const handleChange=(event)=>{
        setForm(prevState => { 
            return {...prevState,[event.target.name]:event.target.value}
        });
    }
    const isFormValid=({channelName,channelDetails})=>channelName&&channelDetails;
    const handleSubmit=()=>{
        if(isFormValid)
        {
           addChannel();
        }
    }




    
    // Function: Add Channel into firebase
    const addChannel=()=>{
        const channelRef=firebase.database().ref("channels")
        const key=channelRef.push().key;
        const newChannel={
            id:key,
            name:form.channelName,
            details:form.channelDetails,
            createdBy:{
                name:userDetail.displayName,
                avatar:userDetail.photoURL
            }
        }
        channelRef.child(key).update(newChannel).then(()=>{
            setForm({channelName:'',channelDetails:''})
            closeModal();
        }).catch((err)=>{
            console.log(err);
        })
    }
    useEffect(()=>{
        if(firstLoad)
        {
            if(channels && channels.length>0)
            {
                const firstChannel = channels[0];
                props.dispatchCurrentChannel(firstChannel);
                props.dispatchPrivateChannel(false);
                props.dispatchActiveChannel(firstChannel);
                // setChannel(firstChannel);
                setFirstLoad(false);
            }
        }
    },[channels,firstLoad])





    // ===== Function: Notifications ======
    const handleNotification=(channelId,currentChannelId,snap)=>{
        console.log("in handle notification \n previous notifications data",notifications);
        let lastTotal=0;
        let dupNotification=[...notifications];
        let index=dupNotification.findIndex(notifi=>notifi.id===channelId)
        if(index!==-1)
        {
            console.log("Found",snap.id)
            let newNotification={...notifications[index]};
            if(channelId!==currentChannelId)
            {
                lastTotal = newNotification.total;
                if (snap.numChildren() - lastTotal > 0) {
                    newNotification.count = snap.numChildren() - lastTotal;
                }
            }
            newNotification.lastKnownTotal = snap.numChildren();
            dupNotification[index]=newNotification;
        }
        else
        {
            console.log("Creating",snap.id)
            dupNotification.push({
                id:channelId,
                total:snap.numChildren(),
                lastKnownTotal:snap.numChildren(),
                count:0
            })
        }
        setnotifications(dupNotification);
    }
    const addNotificationListener=(channelId)=>{
        messageRef.child(channelId).on("value",snap=>{
            if(props.activeChannel)
            {
                console.log("adding Listener")
                handleNotification(channelId,props.activeChannel.id,snap);
            }
        })
    }
    useEffect(()=>{
        if(channels && channels.length>0)
        {
            let newChannel=channels.length;
            addNotificationListener(channels[newChannel-1].id);
        }   
    },[channels])




    // Function: AddListeners
    const addListeners=()=>{
        const loadedChannels=[];
        channelRef.on("child_added",snap=>{
            loadedChannels.push(snap.val());
            const newLoadedChannel=[...loadedChannels];
            setChannels(newLoadedChannel);
            // addNotificationListener(snap.key);
        })
    }
    useEffect(()=>{
        addListeners();
        return ()=>{
            channelRef.off();
            channels.forEach(channel=>{
                messageRef.child(channel.id).off();
            })
        }
    },[])




    // Function: Displaying channel and changing it
    const changeChannel=(channel)=>{
        props.dispatchCurrentChannel(channel);
        props.dispatchPrivateChannel(false);
        props.dispatchActiveChannel(channel.id);
        clearNotification(channel.id);
        typingRef
            .child(channel.id)
            .child(user.uid)
            .remove()
        // setChannel(channel);
    }
    const clearNotification=(id)=>{
        let index=notifications.findIndex(not=>not.id===id)
        if(index!==-1)
        {
            let updateNotification=[...notifications];
            updateNotification[index].total=notifications[index].lastKnownTotal;
            updateNotification[index].count=0;
            setnotifications(updateNotification);
        }
    }
    const getNotificationCount=(channel)=>{
        let count=0;
        notifications.forEach(not=>{
            if(not.id===channel.id)
            {
                count=not.count;
            }
        })
        if(count>0){
            return count;
        }
    }
    const displayChannel = () =>
        channels.length > 0 &&
        channels.map(channel => (
            <MenuItem
                key={channel.id}
                onClick={() => changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 0.7 }}
                active={channel.id===props.activeChannel}

            >
                {
                    getNotificationCount(channel) && (
                        <Label color="red">{getNotificationCount(channel)}</Label>
                    )
                }
                # {channel.name}
            </MenuItem>
    ));
    useEffect(()=>{
        if(channels.length>0 && props.activeChannel===null){
            const firstChannel=channels[0];
            props.dispatchCurrentChannel(firstChannel);
        }
    })






    





    return (
        <Fragment>
            <MenuMenu  className="menu">
                <MenuItem>
                    <span>
                        <Icon name="exchange" /> Channels
                    </span>
                    {channels.length}
                    <Icon name="add" onClick={openModal} />
                </MenuItem>
                {displayChannel()}
            </MenuMenu>
            {/* Add Channel Modal */}
            <Modal basic open={modal} onClose={closeModal}>
                <ModalHeader>Add a Channel</ModalHeader>
                <ModalContent>
                    <Form onSubmit={handleSubmit}>
                        <FormField>
                            {/* Input: ChannelName */}
                            <Input 
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                onChange={handleChange}
                            />
                        </FormField>
                        <FormField>
                            {/* Input: channelDetails */}
                            <Input 
                                fluid
                                label="Detail of Channel"
                                name="channelDetails"
                                onChange={handleChange}
                            />
                        </FormField>
                    </Form>
                </ModalContent>
                <ModalActions>
                    <Button color="green" inverted  onClick={handleSubmit} >
                        <Icon name="checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </ModalActions>
            </Modal>
        </Fragment>
    )
}





const mapStateToProps=state =>{
    return{
        activeChannel:state.currentChannel.activeChannel
    };
  }
const mapDispatchProps=dispatch=>{
    return {
        dispatchCurrentChannel:(channel)=>dispatch(actions.setCurrentChannel(channel)),
        dispatchPrivateChannel:(channel)=>dispatch(actions.setPrivateChannel(channel)),
        dispatchActiveChannel:(userID)=>dispatch(actions.setActiveChannel(userID))
    }
}
export default connect(mapStateToProps,mapDispatchProps)(UserChannel);