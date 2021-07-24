import React,{ Fragment,useState,useEffect,useRef,ReactFragment }from 'react';
import { CommentGroup,  Segment,Image } from 'semantic-ui-react';
import MessageHeader from './Header/header';
import MessageForm from './Form/Form';
import firebase from '../../../firebase/firebase';
import Message from './Message/Message';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import Typing from './TypingAnimation/TypingAnimation';
import Skeleton from './Skeleton/Skeleton';


function Messages({currentChannel,user,isprivatechannel,dispatchSetUsersPosts}) {
    const [messageRef,changeMessageRef]=useState(firebase.database().ref('messages'));
    const [privateMessageRef,changePrivateMessageRef]=useState(firebase.database().ref('privateMessages'));
    const [messages,setMessages]=useState([]);
    const [messageLoading,setMessageLoading]=useState(true);
    const [newImage,setNewImage]=useState(null);
    const [uniqUsers,setUniqUsers]=useState("user");
    const [searchTerm,setSearchTerm]=useState("");
    const [searchLoading,setSearchLoading]=useState(false);
    const [searchResult,setSearchResult]=useState([]);
    // Starred
    const [isChannelStared,setIsChannelStared]=useState(false);
    const [userRef]=useState(firebase.database().ref("users"));
    // Typing users
    const [typingRef]=useState(firebase.database().ref('typing'));
    const [typingUsers,setTypingUsers]=useState([]);
    const [connectedRef]=useState(firebase.database().ref('.info/connected'));
    const [listeners,setListeners]=useState([]);
    // Ref
    const messageEndRef=useRef(null);
    console.log(typingUsers);



    // Message Listener
    const getChannelMessageRef=()=>{
        if(isprivatechannel)
        {
            return privateMessageRef;
        }
        else
        {
            return messageRef;
        }
    }
    const countUserPost=(messages)=>{
        let userPost=messages.reduce((acc,message)=>{
            if(message.user.name in acc)
            {
                acc[message.user.name].count++;
            }
            else
            {
                acc[message.user.name]={
                    avatar:message.user.avatar,
                    count:1
                }
            }
            return acc;
        },{})
        dispatchSetUsersPosts(userPost);
    }
    const addMessageListener=()=>{
        let loadedMessage=[];
        let ref=getChannelMessageRef();
        ref.child(currentChannel.id).once("value").then(function(snapshot) {
            console.log("///////////////",);
            if(!snapshot.exists())
            {
                setMessageLoading(false);
            }
        });
        ref.child(currentChannel.id).on('child_added',(snap)=>{
            loadedMessage.push(snap.val())
            let newLoadedMessage=[...loadedMessage];
            setMessages(newLoadedMessage);
            setMessageLoading(false);
            createUniqueUsers(loadedMessage);
            countUserPost(loadedMessage);
        })
        addToListeners(currentChannel.id,ref,'child_added');
    }
    const addUserStarListener=(channelID,userID)=>{
        userRef
            .child(userID)
            .child("starred")
            .once('value')
            .then(data=>{
            if(data.val() !==null)
            {
                const channelIds=Object.keys(data.val());
                const prevStarred=channelIds.includes(channelID);
                setIsChannelStared(prevStarred);

            }
        })
    }
    const addTypingListener=()=>{
        // currentChannel.id
        let typingUse=[];
        typingRef.child(currentChannel.id).on('child_added',snap=>{
            if(snap.key!==user.uid)
            {
                typingUse=typingUse.concat({
                    id:snap.key,
                    name:snap.val()
                })
                setTypingUsers([...typingUse]);
            }
        })
        addToListeners(currentChannel.id,typingRef,'child_added');

        typingRef.child(currentChannel.id).on('child_removed',snap=>{
            const index=typingUsers.findIndex(user=>user.id===snap.key);
            if(index)
            {
                let typ=[];
                typ=typingUse.filter(user=>user.id!==snap.key)
                setTypingUsers([...typ]);
            }
        })
        addToListeners(currentChannel.id,typingRef,'child_removed');

        connectedRef.on("value",snap=>{
            if(snap.val===true)
            {
                typingRef.child(currentChannel.id).child(user.id).onDisconnect().remove(err=>{
                    if(err!=null)
                    {
                        console.error(err);
                    }
                })
            }
        })

    }
    const addListener=()=>{
        addMessageListener();
        addTypingListener();
    }
    useEffect(()=>{
        if(currentChannel && user)
        {
            addListener();
            addUserStarListener(currentChannel.id,user.uid);
        }
    },[currentChannel,user])

    // Display Messages and channel name
    let displayMessages=(messages)=>(
        messages.length>0 && messages.map((message)=>(
            <Message 
                key={message.timestamp}
                message={message}
                user={user}
            />
        ))
    )
    let displayMessageSkeleton=(loading)=>
        loading 
        ?
            (
                <div>
                    {
                        [...Array(10)].map((k,i)=>(
                            <Skeleton 
                                key={i}
                            />
                        ))
                    }
                </div>
            ) 
        : 
        null;

    const createUniqueUsers=messages=>{
        const uniqueUser=messages.reduce((acc,message)=>{
            if(!acc.includes(message.user.name))
            {
                acc.push(message.user.name);
            }
            return acc;
        },[])
        const plural=uniqUsers.length>1 || uniqueUser.length===0
        const un=`${uniqueUser.length} user${plural?"":"s"}`

        setUniqUsers(un);
    }

    const displayChannelName=()=>{
        return currentChannel?`${isprivatechannel?'@':'#'}${currentChannel.name}`:''
    }
    // SEARCH MESSAGE
    const handleSearchChange=event=>{
        setSearchTerm(event.target.value);
        setSearchLoading(true);
    }
    useEffect(()=>{
            handleSearchMessage();
    },[searchTerm])
    const handleSearchMessage=()=>{
        const channelMessage=[...messages];
        const regx=RegExp(searchTerm,'gi');
        const searchResult=channelMessage.reduce((acc,message)=>{
            if(message.content && message.content.match(regx) || message.user.name.match(regx))
            {
                acc.push(message);
            }
            return acc;
        },[])
        setTimeout(()=>{
            setSearchResult(searchResult);
            setSearchLoading(false);
        },1000)
    }
    

    // Starred
    const handleStar=()=>{
        const is=!isChannelStared;
        setIsChannelStared(is);
    }
    useEffect(()=>{
        if(isChannelStared)
        {
            if(currentChannel!==null)
            {
                userRef
                    .child(`${user.uid}/starred`)
                    .update({
                        [currentChannel.id]:{
                            name:currentChannel.name,
                            details:currentChannel.details,
                            createdBy:{
                                name:currentChannel.createdBy.name,
                                avatar:currentChannel.createdBy.avatar
                            }
                        }
                    });
                }
        }
        else
        {
            if( currentChannel!==null)
            {
                userRef
                    .child(`${user.uid}/starred`)
                    .child(currentChannel.id)
                    .remove(err=>{
                        if(err!=null)
                        {
                            console.log(err);
                        }
                    });
            }
        }
    },[isChannelStared])

    const displayTypingUser=()=>{
        if(typingUsers.length>0)
        {
            return typingUsers.map(user=>{
                return (
                    <div key={user.id} style={{display:"flex",alignItems:"center",marginBottom:"0.2em"}}>
                        <span className="user__typing">{user.name} is typing</span><Typing />
                    </div>
                )
            })
        }
    }
    useEffect(() => {
        if(messageEndRef.current)
        {
            messageEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    }, [messages])

    const addToListeners=(id,ref,event)=>{
        if(listeners)
        {
            const index=listeners.findIndex(listener=>{
                return  (listener.id === id && listener.ref===ref && listener.event===event)
            })
    
            if(index===-1)
            {
                const newListener={id,ref,event}
                setListeners(newListener);
            }
        }
    }
    const removeListeners=(listeners)=>{
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        });
    }
    useEffect(() => {
        return () => {
            removeListeners(listeners);
            connectedRef.off();
        }
    }, [])

    return (
        <Fragment>
            {/* Message Header */}
            <MessageHeader 
                channelName= {displayChannelName()}
                numberOfUser={uniqUsers}
                handleSearchChange={handleSearchChange}
                searchLoading={searchLoading}
                isprivatechannel={isprivatechannel}
                handleStar={handleStar}
                isChannelStared={isChannelStared}
                user={user}
            />

            {/* Message Segment */}
            <Segment>
                <CommentGroup className="messages">
                    {
                        displayMessageSkeleton(messageLoading)
                    }
                    {
                        searchTerm===""?displayMessages(messages):displayMessages(searchResult)
                    }

                    {
                        displayTypingUser()
                    }
                    {/* {newImage?<Image src={newImage} />:null} */}
                    {
                        newImage?<Message 
                            key={newImage}
                            blur
                            message={{
                                image:newImage,
                                user:user
                            }}
                            user={user}
                        />:null
                    }
                    <div ref={node=>(messageEndRef.current=node)}></div>
                </CommentGroup>
            </Segment>

            {/* Message Form */}
            <MessageForm 
                getChannelMessageRef={getChannelMessageRef}
                currentChannel={currentChannel} 
                user={user}
                setNewImage={setNewImage}
                isprivatechannel={isprivatechannel}
            />
        </Fragment>
    
    )
}





const mapStateToProps=state =>{
    return{
        // activeChannel:state.currentChannel.activeChannel
    };
  }
const mapDispatchProps=dispatch=>{
    return {
        dispatchSetUsersPosts:(userPosts)=>dispatch(actions.setUserPosts(userPosts)),
    }
}
export default connect(mapStateToProps,mapDispatchProps)(Messages);