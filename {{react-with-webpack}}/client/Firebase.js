import * as firebase from 'firebase';

// Pur your Firebase information
const config = {
  apiKey: ,
  authDomain: ,
  databaseURL: ,
  storageBucket: ,
};

const fb = firebase.initializeApp(config);

export default fb;
