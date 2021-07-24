import React,{useState,useEffect,useRef} from 'react';
import { Button, ButtonGroup, Input, Segment } from 'semantic-ui-react';
import firebase from '../../../../firebase/firebase';
import FileModal from '../FileModal/FileModal';
import {uuid} from 'uuidv4';
import { Picker,emojiIndex } from 'emoji-mart';
import "emoji-mart/css/emoji-mart.css";
export default function Form(props) {


    // Props Value
    const {getChannelMessageRef,currentChannel,setNewImage}=props;


    // States
    const [message,setMessage]=useState('');
    const [loading,setLoading]=useState(false);
    const [user,setUser]=useState(props.user);
    const [error,setError]=useState('');
    const [modal,setModal]=useState(false);
    const [upload,setUpload]=useState({
        uploadState:'',
        uploadTask:null,
        storageRef:firebase.storage().ref(),
        percentUploaded:null
    })
    const [startUseEffect,setStartUseEffec]=useState({status:true});
    const [typingRef]=useState(firebase.database().ref("typing"));
    const [emojiPicker,setEmojiPicker]=useState(false);
    const focusRef=useRef(null);
    console.log("=>>>>>>>>>>>>>",error);

    // Modal
    const openModal=()=>{setModal(true)}
    const closeModal=()=>{setModal(false)}


    // Functions related to text message
    const handleMessageChange=(event)=>{
        setMessage(event.target.value)
    }
    const createMessage=(fileURL=null)=>{
        const myMessage={
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            user:{
                id:user.uid,
                name:user.displayName,
                avatar:user.photoURL
            },
        }
        if(fileURL===null)
        {
            myMessage['content']=message;
        }
        else
        {
            myMessage['image']=fileURL;
        }
        return myMessage;
    }
    const sendMessage=()=>{
        const {getChannelMessageRef,currentChannel}=props;
        let ref=getChannelMessageRef();

        if(message.length>0)
        {
            setLoading(true);
            ref.child(currentChannel.id).push().set(createMessage()).then(()=>{
                setLoading(false);
                setMessage('');
                setError('');
                typingRef
                .child(currentChannel.id)
                .child(user.uid)
                .remove()
            }).catch((err)=>{
                setLoading(false);
                setError(err);
            });
        }
        else{
            setError("Add a Message!!");
        }
    }



    // Function related to entering the message
    const handleKeyDown=(event)=>{
        if(event.ctrlKey && event.keyCode===13)
        {
            sendMessage();
        }
        if(message)
        {
            typingRef
                .child(currentChannel.id)
                .child(user.uid)
                .set(user.displayName)
        }
        else
        {
            typingRef
            .child(currentChannel.id)
            .child(user.uid)
            .remove()
        }

    }

    // Function related to File upload
        const getPath=()=>{
            if(props.isprivatechannel)
            {
                return `chat/private/${currentChannel.id}`;
            }
            else
            {
                return 'chat/public';
            }
        }
    const uploadFile=(file,meta)=>{
        const filePath=`${getPath()}/${uuid()}`;
        const ref=getChannelMessageRef();
        const newData={
            ...upload,
            uploadState:'uploading',
            uploadTask:upload.storageRef.child(filePath).put(file,meta)
        }
        setUpload(newData);
        setStartUseEffec({status:true});
        setNewImage(URL.createObjectURL(file));
    }
    const sendFileMessage=(fileURL,ref,pathToUpload)=>{
        ref.child(pathToUpload).push().set(createMessage(fileURL)).then(()=>{
            const newData={
                ...upload,
                uploadState:"Done"
            }
            setUpload(newData)
            setStartUseEffec(true);
            setNewImage(null);
        }).catch((err)=>{
            setError(err);
            setNewImage(null);
        })
    }
    // After uploading start 
    useEffect(()=>{
        if(upload.uploadState==='uploading' && upload.uploadTask!=null)
        {
            upload.uploadTask.on("state_change",snap=>{
                const percentUploaded=Math.round((snap.bytesTransferred / snap.totalBytes)*100);
                const newData={
                    ...upload,
                    percentUploaded:percentUploaded
                }
                setUpload(newData);
            },
            // Callback if error occure
            err=>{
                const newData={
                    ...upload,
                    uploadState:'error',
                    uploadTask:null,
                }
                setUpload(newData);
                console.log("-----------------------------------",err.message)
                setError(err.message);
                setNewImage(null);
            },
            // Saving the link in the database
            ()=>{ 
                upload.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                    const pathToUpload=currentChannel.id;
                    const ref=getChannelMessageRef();
                    sendFileMessage(downloadURL,ref,pathToUpload);
                    // If Error occure
                }).catch((err)=>{
                    console.log(err);
                    const newData={
                        ...upload,
                        uploadState:'error',
                        uploadTask:null,
                    }
                    setUpload(newData);
                    setError(err);
                    setNewImage(null);
                })
            })
        }
    },[startUseEffect])


    const handleTogglePicker=()=>{
        setEmojiPicker(!emojiPicker);
    }
    const colonToUnicode = message => {
        return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
          x = x.replace(/:/g, "");
          let emoji = emojiIndex.emojis[x];
          if (typeof emoji !== "undefined") {
            let unicode = emoji.native;
            if (typeof unicode !== "undefined") {
              return unicode;
            }
          }
          x = ":" + x + ":";
          return x;
        });
      };
    const handleAddEmoji=(emoji)=>{
        let oldMessage=message;
        let newMessage=colonToUnicode(`${oldMessage}${emoji.colons}`)
        setMessage(newMessage);
        setEmojiPicker(false);
        setTimeout(()=>{
            focusRef.current.focus();
        },0)
    }
    useEffect(() => {
        return () => {
            if(upload.uploadTask!=null)
            {
                upload.uploadTask.cancel();
                setUpload({...upload,uploadTask:null})
            }
        }
    }, [])




    return (
        <Segment className="message__form">
            {emojiPicker && <Picker 
                set="apple"
                className="emojiPicker"
                title="Pick Your Emoji"
                emoji="point_up"
                onSelect={handleAddEmoji}
            />}
            <Input 
                fluid
                name="message"
                style={{marginBottom:'0.7em'}}
                label={<Button icon={emojiPicker ?"close":"add"} content={emojiPicker?"Close":null} onClick={handleTogglePicker}/>}
                labelPosition="left"
                placeholder="Write your message"
                onChange={handleMessageChange}
                className={
                     error.includes("Message")? 'error' : null
                }
                value={message}
                onKeyDown={handleKeyDown}
                ref={node=>(focusRef.current=node)}
            />
            <ButtonGroup icon width="2">
                <Button 
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                    onClick={sendMessage}
                    disabled={loading}
                />
                <Button 
                    color="teal"
                    content="upload Media"
                    labelPosition="right"
                    icon="cloud upload"
                    onClick={openModal}
                    disabled={upload.uploadState==="uploading"}
                />
            </ButtonGroup>
            <FileModal 
                    modal={modal}
                    closeModal={closeModal}
                    uploadFile={uploadFile}

                /> 
        </Segment>
    )
}
