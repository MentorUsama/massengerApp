import React,{useState} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput,loading} from 'semantic-ui-react';
import { Link } from "react-router-dom";
import firebase from '../../firebase/firebase';
import Contact from './Contact';
export default function Register() {;
    // States
    const [formData,changeForm]=useState({
        username:'',
        email:'',
        password:'',
        passwordConfirmation:''
    });
    const [error,changeError]=useState({message:''});
    const [loading,changingLoading]=useState(false);



    // Stat change handler
    const changeFormData=(event)=>{
        changeForm(prevState => { 
            return {...prevState,[event.target.name]:event.target.value}
        });
    }   


    // Form Validation
    const isFormEmpty=({username,email,password,passwordConfirmation})=>{
        return username.length===0 || email.length===0  || password.length===0  || passwordConfirmation.length===0;
    }
    const isPasswordValid=({password,passwordConfirmation})=>{
        if(password.length<6)
        {
            return false;
        }
        return password===passwordConfirmation;
    }
    const isFormValid=()=>{
        let error;
        if(isFormEmpty(formData))
        {
            error={message:"Please Fill in all fields"};
            changeError(()=>error);
            return false;
        }
        else if(!isPasswordValid(formData))
        {
            error={message:"Please Enter the right password"};
            changeError(error);
            return false;
        }
        else
            return true;
    }


    // Savre user
    const saveUser=(createdUser)=>{
        return firebase.database().ref('users').child(createdUser.user.uid).set({
            name:createdUser.user.displayName,
            avatar:createdUser.user.photoURL
        });
    }
    // Form Submission
    const handleSubmit=(event)=>{
        event.preventDefault();
        if(isFormValid())
        {
            changeError({message:''});
            changingLoading(true);

            firebase.auth().createUserWithEmailAndPassword(
                formData.email,formData.password
            ).then(createdUser=>{
                createdUser.user.updateProfile({
                    displayName:formData.username,
                    photoURL:`http://gravatar.com/avatar/${Math.random()}?d=identicon`
                }).then(()=>{
                    saveUser(createdUser).then(()=>{
                        changeError({message:''});
                        changingLoading(false);
                    })
                })
            }).catch(err=>{
                changeError({message:err.message});
                changingLoading(false);
            });
        }
    }

    // Rendering
    return (
        <div>
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <GridColumn style={{maxWidth:450}}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for DevChat
                    </Header>
                    {error.message!==''?<Message>
                        <p style={{color:'red',fontWeight:'bold'}}>{error.message}</p>
                    </Message>:null}
                    <Form onSubmit={handleSubmit}>
                        <Segment stacked>
                            {/* Username */}
                            <FormInput 
                                fluid  
                                name="username" 
                                icon="user" 
                                iconPosition="left" 
                                placeholder="Username" 
                                onChange={changeFormData} 
                                type="text" 
                                value={formData.username}>
                            </FormInput>
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
                            {/* Password Confirmaiton */}
                            <FormInput 
                                fluid 
                                name="passwordConfirmation" 
                                icon="lock" 
                                iconPosition="left" 
                                placeholder="Confirm Password" 
                                onChange={changeFormData} 
                                type="password" 
                                value={formData.passwordConfirmation}
                                className={error.message.toLowerCase().includes('password')?'error':''}>
                            </FormInput>
                            {/* Submit button */}
                            <Button color="orange" disabled={loading} fluid size="large" className={loading?'loading':''}>Submit</Button>
                        </Segment>
                        <Message>
                            Already a user? <Link to="/Login">Login</Link>
                        </Message>
                        <Contact></Contact>
                    </Form>
                </GridColumn>
            </Grid>
        </div>
    )
}
