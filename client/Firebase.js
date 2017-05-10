import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD16DQg7NsVl1e5Q0W5KNxEsJWHIc4Ezz0",
  authDomain: "blog-90138.firebaseapp.com",
  databaseURL: "https://blog-90138.firebaseio.com",
  storageBucket: "blog-90138.appspot.com",
};

const fb = firebase.initializeApp(config);

export default fb;
