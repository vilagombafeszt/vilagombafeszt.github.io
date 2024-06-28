// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
const backButton2 = document.getElementById('back-button2');
const header = document.getElementById('header');
const menu = document.getElementById('menu');
const bartenderButton = document.getElementById('bartenderstats');
const bartenderstats = document.getElementById('bartenderstat-container');
const foodserverButton = document.getElementById('foodserverstats');
const foodserverstats = document.getElementById('foodserverstat-container');
const summaryButton = document.getElementById('statsummary');
const summarystats = document.getElementById('statsummary-container');

backButton.addEventListener('click', function() {
    if(window.history.length == 0) {
        window.location.href = 'index.html';
    }
    else {
        window.history.back();
    }
});

backButton2.addEventListener('click', function() {
    header.style.display = 'block';
    menu.style.display = 'grid';
    backButton.style.display = 'block';
    backButton2.style.display = 'none';
    bartenderstats.style.display = 'none';
    foodserverstats.style.display = 'none';
    summarystats.style.display = 'none';
});

onAuthStateChanged(auth, (user) => {
    const allowedUids = ['9HBKQhxPThQXX51YLwHKGaLiz0D3', 'JlsebVypa1cYKXiLjIns7MktYmy2'];
    if (allowedUids.includes(user.uid)) {
      // Admin is signed in
        header.style.display = 'block';
        menu.style.display = 'grid';
        fetchAndDisplayStatistics();
    } 
    else {
      // No admin is signed in
      alert('Nincs jogosultságod az admin oldal megtekintéséhez!');
    }
  });

  bartenderButton.addEventListener('click', function() {
    bartenderstats.style.display = 'block';
    backButton2.style.display = 'block';
    backButton.style.display = 'none';
    menu.style.display = 'none';
  });

  foodserverButton.addEventListener('click', function() {
    foodserverstats.style.display = 'block';
    backButton2.style.display = 'block';
    backButton.style.display = 'none';
    menu.style.display = 'none';
  });

  summaryButton.addEventListener('click', function() {
    summarystats.style.display = 'block';
    backButton2.style.display = 'block';
    backButton.style.display = 'none';
    menu.style.display = 'none';
  });

function fetchAndDisplayStatistics() {
  const dbRef = ref(database);
  let isSumNull = true; 
  
  get(child(dbRef, 'Rendelések/Ital')).then((snapshot) => {
    if (snapshot.exists()) {
      const drinkData = snapshot.val();
      updateStatistics(drinkData, 'bartender');
      isSumNull = false;
    } else {
      console.log("No data available for drinks");
      document.querySelector('.bartenderstat-container h3:nth-of-type(1)').innerText = `Rendelt italok száma: 0`;
      document.querySelector('.bartenderstat-container h3:nth-of-type(2)').innerText = `Teljes bevétel: 0 HUF`;
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(dbRef, 'Rendelések/Étel')).then((snapshot) => {
    if (snapshot.exists()) {
      const foodData = snapshot.val();
      updateStatistics(foodData, 'foodserver');
      isSumNull = false;
    } else {
      console.log("No data available for food");
      document.querySelector('.foodserverstat-container h3:nth-of-type(1)').innerText = `Rendelt ételek száma: 0`;
      document.querySelector('.foodserverstat-container h3:nth-of-type(2)').innerText = `Teljes bevétel: 0 HUF`;
    }
  }).catch((error) => {
    console.error(error);
  });

  if (isSumNull) {
    document.querySelector('.statsummary-container h3:nth-of-type(1)').innerText = `Rendelt italok/ételek száma: 0`;
    document.querySelector('.statsummary-container h3:nth-of-type(2)').innerText = `Teljes bevétel: 0 HUF`;
  }
}

var sumOrders = 0;
var sumRevenue = 0;

function updateStatistics(data, type) {
  let totalOrders = 0;
  let totalRevenue = 0;
  
  for (const uid in data) {
    const userOrders = data[uid];
    totalOrders += userOrders.orderList.length;
    totalRevenue += userOrders.totalPrice;
  }

  sumOrders += totalOrders;
  sumRevenue += totalRevenue;

  if (type === 'bartender') {
    document.querySelector('.bartenderstat-container h3:nth-of-type(1)').innerText = `Rendelt italok száma: ${totalOrders}`;
    document.querySelector('.bartenderstat-container h3:nth-of-type(2)').innerText = `Teljes bevétel: ${totalRevenue} HUF`;
  } 
  else if (type === 'foodserver') {
    document.querySelector('.foodserverstat-container h3:nth-of-type(1)').innerText = `Rendelt ételek száma: ${totalOrders}`;
    document.querySelector('.foodserverstat-container h3:nth-of-type(2)').innerText = `Teljes bevétel: ${totalRevenue} HUF`;
  }

  document.querySelector('.statsummary-container h3:nth-of-type(1)').innerText = `Rendelt italok/ételek száma: ${sumOrders}`;
  document.querySelector('.statsummary-container h3:nth-of-type(2)').innerText = `Teljes bevétel: ${sumRevenue} HUF`;  

}