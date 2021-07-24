import React from 'react'
import { Comment, CommentAvatar, CommentContent, CommentMetadata,CommentAuthor, CommentText, Image } from 'semantic-ui-react'
import moment from 'moment';

export default function Message({user,message,blur=false}) {
    const isOwnMessage=()=>{
        return message.user.id === user.uid
    }
    const timeFromNow=(timestamp)=>{
        return moment(timestamp).fromNow()
    }
    const isImage=(message)=>{
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
    }
    return (
        <Comment>
            <CommentAvatar src={message.user.avatar} />
            <CommentContent className={isOwnMessage()?"message__self":""}>
                <CommentAuthor as="a">{message.user.name}</CommentAuthor>
                <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>
                {isImage(message)?
                    <Image src={message.image} className={blur?"message__image message__image__blur":"message__image"}/>
                    :
                    <CommentText>{message.content}</CommentText>
                }
            </CommentContent>
        </Comment>
    )
}
