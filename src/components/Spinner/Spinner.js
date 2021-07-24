import React from 'react';
import {Loader,Dimmer} from 'semantic-ui-react';

export default function spinner() {
    return (
        <Dimmer active>
            <Loader size="huge" content="preparing chat..."/>
        </Dimmer>
    )
}
