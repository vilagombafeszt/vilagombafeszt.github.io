// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

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

const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    // Inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        alert('Sikeres bejelentkezés!');
        toggleLoginForm();
        location.reload();
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      afterLogin();
      const bartenderButton = document.getElementById('bartender');
      const ticketClerkButton = document.getElementById('ticket-clerk');
      const programsButton = document.getElementById('programs');
      const adminButton = document.getElementById('admin');
        bartenderButton.addEventListener('click', function() {
            window.location.href = 'bartender.html';
        });
        ticketClerkButton.addEventListener('click', function() {
            window.location.href = 'ticketclerk.html';
        });
        programsButton.addEventListener('click', function() {
          window.location.href = 'programs.html';
        });
        adminButton.addEventListener('click', function() {
          const allowedUids = ['9HBKQhxPThQXX51YLwHKGaLiz0D3', 'JlsebVypa1cYKXiLjIns7MktYmy2'];
            if (allowedUids.includes(user.uid)) {
                window.location.href = 'admin.html';
            } else {
                alert('Nincs jogosultságod az admin oldal megtekintéséhez!');
            }
        });
    } 
    else {
      // No user is signed in
      loginButton.style.display = 'block';
      loggedInMessage.style.display = 'none';
      headerContent.style.flexDirection = 'row';
      setMenuMarginTo20();
      const bartenderButton = document.getElementById('bartender');
      const ticketClerkButton = document.getElementById('ticket-clerk');
      const programsButton = document.getElementById('programs');
      const adminButton = document.getElementById('admin');
      bartenderButton.addEventListener('click', function() {
        alert('Kérlek jelentkezz be!');
      });
      ticketClerkButton.addEventListener('click', function() {
        alert('Kérlek jelentkezz be!');
      });
      programsButton.addEventListener('click', function() {
        alert('Kérlek jelentkezz be!');
      });
      adminButton.addEventListener('click', function() {
        alert('Kérlek jelentkezz be!');
      });
    }
  });

