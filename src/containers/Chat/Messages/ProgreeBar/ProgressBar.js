import React from 'react';
import {Progress} from 'semantic-ui-react';

export default function ProgressBar({uploadState,percentUpload}) {
    return (
        uploadState==="uploading" && <Progress 
                            className="progress__bar"
                            percent={percentUpload}
                            progress
                            indicating
                            size="medium"
                            inverted
                        />
    )
}
