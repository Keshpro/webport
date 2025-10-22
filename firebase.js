// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDvn5ltUxh-K5-h3AJ9Uh8_DkKaTpAKc_Y",
  authDomain: "your-app-id.firebaseapp.com",
  projectId: "webportfolio-xp",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let currentUser = null;

auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (user) {
    initializeAdminPage();
  } else {
    showLoginModal();
  }
});
