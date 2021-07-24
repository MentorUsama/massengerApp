import React,{useState} from 'react';
import { Segment,Header,Accordion,AccordionTitle,Icon,ListDescription, AccordionContent,Image,List, ListItem, ListContent, ListHeader } from 'semantic-ui-react';


const Contact=({defaultVisiility=-1})=>{
    const [activeIndex,setActiveIndex]=useState(defaultVisiility);
    const setActiveIndexValue=(event,titleProps)=>{
        const {index}=titleProps;
        const newIndex=activeIndex===index?-1:index;
        setActiveIndex(newIndex);
    }
    return (
        <Accordion styled attached="true">
            <AccordionTitle active={activeIndex===0} index={0} onClick={setActiveIndexValue} style={{textAlign:"left"}}>
                <Icon name="dropdown"></Icon>
                <Icon name="info"/>
                Developer Information
            </AccordionTitle>
            <AccordionContent active={activeIndex===0}>
                <a  href="https://github.com/MentorUsama" target="_blank" style={{marginTop:'20px'}}>
                    <Segment>
                        <Icon name="github" />
                        Github
                    </Segment>
                </a>
                <a href="https://www.upwork.com/freelancers/~01a36c260b24da516c" target="_blank" style={{marginTop:'20px'}}>
                    <Segment>
                        <Icon name="hire a helper" />
                        Upwork
                    </Segment>
                </a>
                <a href="https://api.whatsapp.com/send?phone=+923472547540&text=Hello%2C%20Usama%20Farhat" target="_blank" style={{marginTop:'20px'}}>
                    <Segment>
                        <Icon name="whatsapp" />
                        Whatsapp
                    </Segment>
                </a>
            </AccordionContent>
        </Accordion>
    )
}

export default Contact;
