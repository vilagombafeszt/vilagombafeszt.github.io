import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

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
  const auth = getAuth(app);

const realtimeCal = document.getElementById('realtime');
const agendaCal = document.getElementById('agenda');
const realtimeContainer = document.getElementById('realtime-container');
const agendaContainer = document.getElementById('agenda-container');
const menu = document.getElementById('menu');
const back1 = document.getElementById('back-button1');
const back2 = document.getElementById('back-button2');

back1.addEventListener('click', function() {
    window.location.href = 'index.html';
});

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
        console.log("User authenticated:", user.uid);
        realtimeCal.addEventListener('click', function() {
            showRealtime();
        });
        agendaCal.addEventListener('click', function() {
            showAgenda();
        });
    } 
    else {
      // No user is signed in
        console.log("User not authenticated!");
        realtimeCal.addEventListener('click', function() {
            alert('Kérjük, jelentkezzen be az oldal használatához!');
        });
        agendaCal.addEventListener('click', function() {
            alert('Kérjük, jelentkezzen be az oldal használatához!');
        });
        alert('Kérjük, jelentkezzen be az oldal használatához!');
        window.location.href = 'index.html';
    }
  });

function showRealtime() {
    realtimeContainer.style.display = 'block';
    agendaContainer.style.display = 'none';
    menu.style.display = 'none';
    back1.style.display = 'none';
    back2.style.display = 'block';
};

function showAgenda() {
    agendaContainer.style.display = 'block';
    realtimeContainer.style.display = 'none';
    menu.style.display = 'none';
    back1.style.display = 'none';
    back2.style.display = 'block';
};

back2.addEventListener('click', function() {
    realtimeContainer.style.display = 'none';
    agendaContainer.style.display = 'none';
    menu.style.display = 'grid';
    back1.style.display = 'block';
    back2.style.display = 'none';
});


document.addEventListener('DOMContentLoaded', () => {
    const realtimeContainer = document.getElementById('realtime-container').querySelector('iframe');
    const agendaContainer = document.getElementById('agenda-container').querySelector('iframe');

    function resizeIframes() {
        const newWidth = window.innerWidth - 50;
        const newHeight = window.innerHeight - 150;

        realtimeContainer.style.width = `${newWidth}px`;
        realtimeContainer.style.height = `${newHeight}px`;

        agendaContainer.style.width = `${newWidth}px`;
        agendaContainer.style.height = `${newHeight}px`;
    }

    // Initial resize
    resizeIframes();

    // Resize on window resize
    window.addEventListener('resize', resizeIframes);
});