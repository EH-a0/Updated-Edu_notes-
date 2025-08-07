const firebaseConfig = {
    apiKey: "AIzaSyDk1gPs7aDcvedRVNLEPP-fm5YAWSotd8c",
    authDomain: "edu-notes-93382.firebaseapp.com",
    projectId: "edu-notes-93382",
    storageBucket: "edu-notes-93382.firebasestorage.app",
    messagingSenderId: "389508732094",
    appId: "1:389508732094:web:fbc3757564e0deafbffaef",
    measurementId: "G-J8L4DQHNTB"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();