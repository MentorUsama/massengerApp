import './App.css';
import React,{useEffect} from 'react';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Chat from './Chat/chat';
import Spinner from '../components/Spinner/Spinner';
// Router Imports
import { BrowserRouter as Router, Switch, Route,withRouter } from "react-router-dom";
// Firebase Imports
import firebase from '../firebase/firebase';
// Redux Imports
import reducer from '../store/reducers/index';
import * as actions from '../store/actions/index';
import { Provider,connect } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// Creating Store
const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));
const store=createStore(reducer,enhancer);





function App(props) {
  // Redirect to / if login
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user=>{
        if(user)
        {

          props.setUser(user);
          props.history.push("/");
        }
        else
        {
          props.history.push("/Login");
          props.clearUser();
        }
    })
  },[props.history]);
  
  return (
    props.isLoading?<Spinner />:
    <div className="app">
        <Switch>
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
          <Route exact path="/" component={Chat} />
        </Switch>
    </div>
  );
}





// Wrapping withRouter for getting props and connect it to the store
const mapDispatchProps=dispatch=>{
  return {
      setUser:(user)=>dispatch(actions.setUser(user)),
      clearUser:()=>dispatch(actions.clearUser()),
  }
}
const mapStateToProps=state =>{
  return{
      isLoading:state.user.isLoading
  };
}
const AppWithRouter=withRouter(connect(mapStateToProps,mapDispatchProps)(App));
function AppWithAuth() 
{
  return(
    <Provider store={store}>
      <Router>
        <AppWithRouter />
      </Router>
    </Provider>
  )
}
export default AppWithAuth;