// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

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

const lunchButton = document.getElementById('lunch');
const dinnerButton = document.getElementById('dinner');
const backButton = document.getElementById('back-button');

backButton.addEventListener('click', function() {
    window.location.href = 'index.html';
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User authenticated:", user.uid);
    lunchButton.addEventListener('click', function() {
        window.location.href = 'lunchserver.html';
    });

    dinnerButton.addEventListener('click', function() {
        window.location.href = 'dinnerserver.html';
    });
  } else {
    // No user is signed in
    console.log("User not authenticated, redirecting to login");
    alert('Kérjük, jelentkezzen be az oldal használatához!');
    window.location.href = 'index.html';
  }
});