import React,{useState} from 'react';
import { Segment,Header,Accordion,AccordionTitle,Icon,ListDescription, AccordionContent,Image,List, ListItem, ListContent, ListHeader } from 'semantic-ui-react';

export default function MetaPannel(props) {
    const [activeIndex,setActiveIndex]=useState(0);
    const setActiveIndexValue=(event,titleProps)=>{
        const {index}=titleProps;
        const newIndex=activeIndex===index?-1:index;
        setActiveIndex(newIndex);
    }
    const formatCount=(num)=>(num>1 || num===0) ? `${num} posts`:`${num} posts`;
    const displayUserPosts=(userPosts)=>{

            return Object.entries(userPosts)
                .sort((a,b)=>b[1]-a[1])
                .map(([key,val],i)=>(
                <ListItem key={i}>
                    <Image avatar src={val.avatar}/>
                    <ListContent>
                        <ListHeader as="a"> {key} </ListHeader>
                        <ListDescription> {formatCount(val.count)}</ListDescription>
                    </ListContent>
                </ListItem>
            )).slice(0,5);

    }

    if(props.isprivatechannel) return null;
    return (
        <Segment loading={!props.currentChannel}>
            <Header as="h3" attached="top">
                About # {props.currentChannel && props.currentChannel.name}
            </Header>
            <Accordion styled attached="true">


                {/* Detail 1 */}
                <AccordionTitle
                    active={activeIndex===0}
                    index={0}
                    onClick={setActiveIndexValue}
                >
                    <Icon name="dropdown"></Icon>
                    <Icon name="info"/>
                    Channel Detail
                </AccordionTitle>
                <AccordionContent active={activeIndex===0}>
                        {props.currentChannel && props.currentChannel.details}
                    </AccordionContent>


                {/* Detail 2 */}
                <AccordionTitle
                    active={activeIndex===1}
                    index={1}
                    onClick={setActiveIndexValue}
                >
                    <Icon name="dropdown"></Icon>
                    <Icon name="user circle"/>
                    Top Posters
                </AccordionTitle>
                <AccordionContent active={activeIndex===1}>
                    <List>
                            {props.userPosts && displayUserPosts(props.userPosts)}
                    </List>
                </AccordionContent>


                {/* Detail 3 */}
                <AccordionTitle
                    active={activeIndex===2}
                    index={2}
                    onClick={setActiveIndexValue}
                >
                    <Icon name="dropdown"></Icon>
                    <Icon name="pencil alternate"/>
                    Created By
                </AccordionTitle>
                <AccordionContent active={activeIndex===2}>
                    <Header as="h3">
                        {props.currentChannel && <Image src={props.currentChannel.createdBy.avatar} />}
                        {props.currentChannel && props.currentChannel.createdBy.name}
                    </Header>
                </AccordionContent>
            </Accordion>
        </Segment>
    )
}
