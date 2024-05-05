import firebase from 'firebase/compat/app';
import 'firebase/database';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBL902gTIkX1gFsPTfYjxT6chUn6rMp3Rg",
    authDomain: "apartments-info-storage.firebaseapp.com",
    projectId: "apartments-info-storage",
    storageBucket: "apartments-info-storage.appspot.com",
    messagingSenderId: "654787525817",
    appId: "1:654787525817:web:c42452a31608e3326fef68",
    measurementId: "G-Y7H206R980",
    databaseURL: "https://apartments-info-storage-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = firebase.initializeApp(firebaseConfig);

export default getDatabase(app);
