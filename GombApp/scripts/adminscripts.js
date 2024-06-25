// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAUIzNyW_fNZ00CN31_vLn7chuZxR6O2_s",
  authDomain: "gombapp-vilagomba.firebaseapp.com",
  projectId: "gombapp-vilagomba",
  databaseURL: "https://gombapp-vilagomba-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "gombapp-vilagomba.appspot.com",
  messagingSenderId: "601093472181",
  appId: "1:601093472181:web:b62f83fbfd296f1e7de3fc",
  measurementId: "G-X958E6F491"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

const backButton = document.getElementById('back-button');
const header = document.getElementById('header');
const menu = document.getElementById('menu');

backButton.addEventListener('click', function() {
    if(window.history.length == 0) {
        window.location.href = 'index.html';
    }
    else {
        window.history.back();
    }
});

onAuthStateChanged(auth, (user) => {
    const allowedUids = ['9HBKQhxPThQXX51YLwHKGaLiz0D3', 'JlsebVypa1cYKXiLjIns7MktYmy2'];
    if (allowedUids.includes(user.uid)) {
      // Admin is signed in
        header.style.display = 'block';
        menu.style.display = 'grid';
    } 
    else {
      // No admin is signed in
      alert('Nincs jogosultságod az admin oldal megtekintéséhez!');
    }
  });