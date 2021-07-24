import React,{useState,useEffect,Fragment} from 'react';
import { Sidebar,Menu, Divider, Button, Modal,Icon, Label,ModalHeader,ModalContent,ModalActions,Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import firease from './../../../firebase/firebase';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
function ColorPanel({user,dispatchColor}) {
    // States
    const [modal,setModal]=useState(false);
    const [color,setColor]=useState("");
    const [primaryColor,setPrimaryColor]=useState("#40b543");
    const [secondaryColor,setSecondaryColor]=useState("#2d4d86");
    const [userRef]=useState(firease.database().ref("users"));
    const [userColor,setUserColor]=useState([]);
    // Functions
    const openModel=()=>{setModal(true);}
    const closeModel=()=>{setModal(false);}
    const handleChangePrimary=(color)=>{setPrimaryColor(color);}
    const handleChangeSecondary=(color)=>{setSecondaryColor(color);}
    const handleSaveColor=()=>{
        if(primaryColor && secondaryColor && user)
        {
            userRef.child(`${user.uid}/colors`).push().update({
                primary:primaryColor,
                secondary:secondaryColor
            }).then(()=>{
                closeModel();
            }).catch((err)=>{
                console.log(err);
            });
        }
    }

    useEffect(() => {
        if(user)
        {
            addEventListener(user.uid);
        }
        return ()=> {
            removeEventListener()
        }
    },[])
    const addEventListener=(userId)=>{
        let userColors=[];
        userRef
            .child(`${userId}/colors`)
            .on("child_added",snap=>{
                userColors.unshift(snap.val());

                setUserColor([...userColors]);
            })
    }
    const removeEventListener=()=>{
        userRef.child(`${user.uid}/colors`).off();
    }   
    const displayUserColor=(colors)=>{
        return colors.length>0 && colors.map((color,i)=>(
            <Fragment>
                <Divider />
                <div className="color__container" onClick={()=>dispatchColor(color.primary.hex,color.secondary.hex)}>
                    <div className="color__square" style={{backgroundColor:color.primary.hex}}>
                        <div className="color__overlay" style={{backgroundColor:color.secondary.hex}}>

                        </div>
                    </div>
                </div>
            </Fragment>
        ))
    }
    return (
            <Sidebar
                as={Menu}
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
                <Divider></Divider>
                <Button icon="add" size="small" color="blue" onClick={openModel}/> 
                {displayUserColor(userColor)}
                {/* Color Picker Modal */}
                <Modal basic open={modal} onClose={closeModel}>
                    <ModalHeader>Choose App Color</ModalHeader>
                    {/* Modal Content */}
                    <ModalContent>
                        <Segment inverted>
                            <Label content="Primary Color" />
                            <SliderPicker color={primaryColor} onChange={handleChangePrimary}/>
                        </Segment>
                        <Segment inverted>
                            <Label content="Secondary Color" />
                            <SliderPicker color={secondaryColor} onChange={handleChangeSecondary} />
                        </Segment>
                    </ModalContent>
                    {/* Modal Action */}
                    <ModalActions>
                        <Button color="green" inverted onClick={handleSaveColor}><Icon name="checkmark" /> Save Color</Button>
                        <Button color="red" inverted onClick={closeModel}><Icon name="remove"/> Cancel</Button>
                    </ModalActions>
                </Modal>
            </Sidebar>
    )
}



const mapStateToProps=state =>{
    return{
        primaryColor:state.currentChannel.primaryColor,
        secondaryColor:state.currentChannel.secondaryColor
    };
}
const mapDispatchProps=dispatch=>{
    return {
        dispatchColor:(primary,secondary)=>dispatch(actions.setColors(primary,secondary))
    }
  }
export default connect(mapStateToProps,mapDispatchProps)(ColorPanel);
