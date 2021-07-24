import React from 'react';
import {Menu} from 'semantic-ui-react';
import UserPanel from './UserPanel/UserPanel';
import Channels from './UserChannel/UserChannel';
import DirectMessage from './DirectMessage/DirectMessage';
import Stared from './Stared/Stared';

export default function SidePanel(props) {
    const {user}=props;
    return (
        <Menu
            size="large"
            inverted
            fixed="left"
            vertical
            style={{background:props.primaryColor,fontSize:'1.2rem'}}
        >
            <UserPanel user={user} primaryColor={props.primaryColor}></UserPanel>
            <Stared user={user} />
            <Channels user={user}></Channels>
            <DirectMessage user={user} />
        </Menu>
    )
}
