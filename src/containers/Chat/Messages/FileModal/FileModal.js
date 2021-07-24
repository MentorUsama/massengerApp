import React ,{useState} from 'react';
import { Modal, ModalContent, ModalHeader,Input, ModalActions, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

export default function FileModal(props) {
    // State
    const {modal,closeModal}=props;
    const [file,changeFile]=useState(null);
    const [authorized,setAuthorized]=useState(['image/jpeg','image/png'])

    // Save file
    const addFile=(event)=>{
        const file=event.target.files[0];
        changeFile(file);
    }
    const isAuthorized=(fileName)=>{
        return authorized.includes(mime.lookup(fileName));
    }
    const clearFile=()=>{
        changeFile(null);
    }
    const sendFile=()=>{
        if(file!=null)
        {
            if(isAuthorized(file.name))
            {
                const metaData={
                    contentType:mime.lookup(file.name)
                }
                props.uploadFile(file,metaData);
                clearFile();
                closeModal();
            }
        }
    }
    return (
        <Modal basic open={modal} onClose={closeModal}>
            <ModalHeader>Select an Image File</ModalHeader>
            <ModalContent>
                <Input 
                    fluid
                    lable="file type: jpg and png"
                    name="file"
                    type="file"
                    onChange={addFile}
                />
            </ModalContent>
                <ModalActions>
                    <Button
                        color="green"
                        inverted
                        onClick={sendFile}
                    >
                        <Icon name="checkmark"/>Send
                    </Button>

                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" />Remove
                    </Button>
                </ModalActions>
        </Modal>
    )
}
