import React,{useState,useRef,useEffect} from 'react';
import {Dropdown, Grid, GridColumn, GridRow,Header, HeaderContent,Icon,Image,Modal,ModalHeader,ModalContent,Input,ModalActions, Button} from 'semantic-ui-react';
import firebase from '../../../../firebase/firebase';
import AvatarEditor from 'react-avatar-editor';

function UserPanel(props) {
    const {user}=props;
    const [modal,setModal]=useState(false);
    const [previewImages,setPreviewImages]=useState("");
    const avatarEditor=useRef(null);
    const [cropedImage,setCropedImage]=useState(null);
    const [storageRef]=useState(firebase.storage().ref())
    const [usersRef]=useState(firebase.database().ref('users'))
    const [userRef]=useState(firebase.auth().currentUser);
    const [metadata]=useState({
        contentType:'image/jpeg'        
    })
    const [uploadedCroppedImage,setUploadedCroppedImage]=useState(null);
    // Signout function
    const signout=()=>{
        firebase.auth().signOut().then(()=>{
            console.log("Signout");
        })
    }


    // Dropdown
    const dropDownOption=()=>[
        {
            key:'user',
            text:<span>Signed In As <strong>{user.displayName && user.displayName }</strong></span>,
            disabled:true
        },
        {
            key:'Avatar',
            text:<span onClick={openModal}>Change Avatar</span>
        },
        {
            key:'Signout',
            text:<span onClick={signout}>Signout</span>
        }
    ]


    // Modal for images
    const openModal=()=>{setModal(true)}
    const closeModal=()=>{setModal(false)}
    const handleChange=(event)=>{
        const file=event.target.files[0];
        const reader=new FileReader();
        if(file)
        {
            reader.readAsDataURL(file);
            reader.addEventListener('load',()=>{
                setPreviewImages(reader.result);
            })
        }
    }
    const handleCropImage=()=>{
        console.log("Yoooo")
        if(avatarEditor.current)
        {
            console.log("Yoooo")
            avatarEditor.current.getImageScaledToCanvas().toBlob(blob=>{
                let imgURL=URL.createObjectURL(blob);
                setCropedImage({
                    croppedImage:imgURL,
                    blob
                });
            })
        }
    }
    const uploadCroppedImage=()=>{
        storageRef
            .child(`avatars/user/${userRef.uid}`)
            .put(cropedImage.blob,metadata)
            .then(snap=>{
                snap.ref.getDownloadURL().then(downloadURL=>{
                    setUploadedCroppedImage(downloadURL);
                })
            })
    }
    const changeAvatar=()=>{
        userRef.updateProfile({
            photoURL:uploadedCroppedImage
        }).then(()=>{
            console.log("updated");
            closeModal();
        })
        .catch(err=>{
            console.log(err);
        })
        usersRef
            .child(user.uid)
            .update({avatar:uploadedCroppedImage})
            .then(()=>{
                console.log("user avatar update")
            })
            .catch((err)=>{
                console.log(err)
            })
    }
    useEffect(() => {
        if(uploadedCroppedImage)
        {
            changeAvatar();
        }
    }, [uploadedCroppedImage])


    return (
        <Grid style={{background:props.primaryColor}}>
            <GridColumn>
                <GridRow style={{padding:'1.2em',margin:0}}>


                    {/* Main Header */}
                    <Header inverted floated="left" as="h2">
                        <Icon name="code"/>
                        <HeaderContent>Dev Chat</HeaderContent>
                    </Header>
                </GridRow>


                {/* Logout */}
                <Header style={{padding:'0.25em'}} as="h4" inverted>
                    <Dropdown 
                        trigger=
                        {
                            <span>
                                <Image src={user.photoURL} spaced="right" avatar  />
                                {user.displayName}
                            </span>
                        }
                        options={dropDownOption()}
                    />
                </Header>
            </GridColumn>

            {/* Change user avcata modal*/}
            <Modal basic open={modal} onClose={closeModal}>
                <ModalHeader>Change Avatar</ModalHeader>
                <ModalContent>
                    <Input 
                        fluid
                        type="file"
                        label="New Avatar"
                        name="previewImage"
                        onChange={handleChange}
                    />
                    {/* ============ Image Preview and Crops ========================= */}
                    <Grid centered stackable columns={2}>
                        <GridRow centered>
                            <GridColumn className="ui center aligned grid">
                                {previewImages && (
                                    <AvatarEditor
                                        ref={node=>(avatarEditor.current=node)}
                                        image={previewImages}
                                        width={120}
                                        height={120}
                                        border={50}
                                        scale={1.2}
                                    >
                                    </AvatarEditor>
                                )}
                            </GridColumn>
                            <GridColumn>
                                {/* Croped Image Preview */}
                                {cropedImage && (
                                    <Image 
                                        style={{margin:"3.5em auto"}}
                                        width={100}
                                        height={100}
                                        src={cropedImage.croppedImage}
                                    />
                                )}
                            </GridColumn>
                        </GridRow>
                    </Grid>
                </ModalContent>
                <ModalActions>
                    {cropedImage && <Button color="green" inverted onClick={uploadCroppedImage}><Icon  name="save"/> Change Avatar</Button>}
                    <Button color="green" inverted onClick={handleCropImage}><Icon  name="image" /> Image Preview</Button>
                    <Button color="red" inverted onClick={closeModal}><Icon  name="remove" /> Cancel</Button>
                </ModalActions>
            </Modal>
        </Grid>
    )
}
export default UserPanel;