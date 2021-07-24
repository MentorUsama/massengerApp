import React,{useState} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput,loading} from 'semantic-ui-react';
import { Link } from "react-router-dom";
import firebase from '../../firebase/firebase';
import Contact from './Contact';





export default function Login() {
    // States
    const [formData,changeForm]=useState({
        email:'',
        password:'',
    });
    const [error,changeError]=useState({message:''});
    const [loading,changingLoading]=useState(false);
    // Stat change handler
    const changeFormData=(event)=>{
        changeForm(prevState => { 
            return {...prevState,[event.target.name]:event.target.value}
        });
    }   
    // Form Submission
    const handleSubmit=(event)=>{
        event.preventDefault();
        changingLoading(true);
        if(isFormValid)
        {
            firebase
            .auth()
            .signInWithEmailAndPassword(formData.email,formData.password)
            .then(signedInUser=>{
                changeError({message:''});
                changingLoading(false);
            })
            .catch(err=>{
                changeError({message:err.message});
                changingLoading(false);
            })
        }
    }
    const isFormValid=({email,password})=>email && password;
    // Rendering
    return (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <GridColumn style={{maxWidth:450}}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login for DevChat
                    </Header>
                    {error.message!==''?<Message>
                        <p style={{color:'red',fontWeight:'bold'}}>{error.message}</p>
                    </Message>:null}
                    <Form onSubmit={handleSubmit}>
                        <Segment stacked>
                            {/* Mail */}
                            <FormInput 
                                fluid 
                                name="email" 
                                icon="mail" 
                                iconPosition="left" 
                                placeholder="Email" 
                                onChange={changeFormData} 
                                type="email" 
                                value={formData.email}
                                className={error.message.toLowerCase().includes('email')?'error':''}>
                            </FormInput>
                            {/* Password */}
                            <FormInput 
                                fluid 
                                name="password" 
                                icon="lock" 
                                iconPosition="left" 
                                placeholder="password" 
                                onChange={changeFormData} 
                                type="password" 
                                value={formData.password}
                                className={error.message.toLowerCase().includes('password')?'error':''}>
                            </FormInput>
                            {/* Submit button */}
                            <Button color="violet" disabled={loading} fluid size="large" className={loading?'loading':''}>Submit</Button>
                        </Segment>
                        <Message>
                            Did not have login account? <Link to="/Register">Register</Link>
                        </Message>
                        <Contact></Contact>
                    </Form>
                </GridColumn>
            </Grid>
        </div>
    )
}