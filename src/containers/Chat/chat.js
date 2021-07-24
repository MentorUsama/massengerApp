import React from 'react';
import {Grid, GridColumn} from 'semantic-ui-react';
// Importing Components
import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPannel/MetaPannel';
import SidePanel from './SidePanel/SidePanel';
import { connect } from 'react-redux';
import Contact from './../Auth/Contact';

function chat({currentChannel,user,isprivatechannel,userPosts,primaryColor,secondaryColor}) {
    return (
        <Grid columns="equal" style={{backgroundColor:secondaryColor,height:'100%',padding:'1rem'}}>
            <ColorPanel 
                user={user}
                key={user && user.name}
            >
                
            </ColorPanel>
            <SidePanel 
                user={user} 
                key={user && user.id}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />
            <GridColumn style={{marginLeft:'320px'}}>
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    user={user}
                    isprivatechannel={isprivatechannel}
                />
            </GridColumn>
            <GridColumn width="4">
                <MetaPanel 
                    isprivatechannel={isprivatechannel}
                    key={currentChannel && currentChannel.id}
                    currentChannel={currentChannel}
                    userPosts={userPosts}
                >
                </MetaPanel>
                <Contact defaultVisiility={0}></Contact>
            </GridColumn>
        </Grid>
    )
}
const mapStateToProps=state =>{
    return{
        user:state.user.currentUser,
        currentChannel:state.currentChannel.currentChannel,
        isprivatechannel:state.currentChannel.isPrivateChannel,
        userPosts:state.currentChannel.userPosts,
        primaryColor:state.currentChannel.primaryColor,
        secondaryColor:state.currentChannel.secondaryColor
    };
}
export default connect(mapStateToProps,null)(chat);
