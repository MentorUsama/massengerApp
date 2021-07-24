import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import "firebase/storage";

var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;