// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
import { getFirestore, doc, getDoc }  from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";


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
const firestoreDB = getFirestore(app);

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
    window.location.href = 'index.html';
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const adminDocRef = doc(firestoreDB, 'admins', 'admin');
    try {
      const docSnap = await getDoc(adminDocRef);
      if (docSnap.exists()) {
        const adminData = docSnap.data();
        if (adminData[user.uid] === true) { // Check if the user's UID exists and is true
          header.style.display = 'block';
          menu.style.display = 'grid';
          fetchAndDisplayStatistics();
        } else {
          // User is not an admin
          alert('Nincs jogosultságod az admin oldal megtekintéséhez!');
          window.location.href = 'index.html';
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  } else {
    // No user is signed in
    alert('Nincs jogosultságod az admin oldal megtekintéséhez!');
     window.location.href = 'index.html';
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
      document.querySelector('.bartenderstat-container h3:nth-of-type(1)').innerText = `Rendelt italok száma: 0 db`;
      document.querySelector('.bartenderstat-container h3:nth-of-type(2)').innerText = `Rendelések száma: 0 db`;
      document.querySelector('.bartenderstat-container h3:nth-of-type(3)').innerText = `Legtöbbet rendelt ital: N/A`;
      document.querySelector('.bartenderstat-container h3:nth-of-type(4)').innerText = `Teljes bevétel: 0 HUF`;
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
      document.querySelector('.foodserverstat-container h3:nth-of-type(1)').innerText = `Rendelt ételek száma: 0 db`;
      document.querySelector('.foodserverstat-container h3:nth-of-type(2)').innerText = `Rendelések száma: 0 db`;
      document.querySelector('.foodserverstat-container h3:nth-of-type(3)').innerText = `Legtöbbet rendelt étel: N/A`;
      document.querySelector('.foodserverstat-container h3:nth-of-type(4)').innerText = `Teljes bevétel: 0 HUF`;
    }
  }).catch((error) => {
    console.error(error);
  });

  if (isSumNull) {
    document.querySelector('.statsummary-container h3:nth-of-type(1)').innerText = `Rendelt italok/ételek száma: 0 db`;
    document.querySelector('.statsummary-container h3:nth-of-type(2)').innerText = `Rendelések száma: 0 db`;
    document.querySelector('.statsummary-container h3:nth-of-type(3)').innerText = `Teljes bevétel: 0 HUF`;
  }
}

var sumOrders = 0;
var sumOrderCount = 0;
var sumRevenue = 0;

function updateStatistics(data, type) {
  let totalOrders = 0;
  let totalOrderCount = 0;
  let totalRevenue = 0;
  let itemCounts = {};
  
  for (const uid in data) {
    const userOrders = data[uid];
    totalOrders += userOrders.orderList.length;
    totalOrderCount += userOrders.orderCount;
    totalRevenue += userOrders.totalPrice;

    userOrders.orderList.forEach((item) => {
      if (itemCounts[item.name]) {
        itemCounts[item] += 1;
      }
      else {
        itemCounts[item] = 1;
      }
    });
  }

  sumOrders += totalOrders;
  sumOrderCount += totalOrderCount;
  sumRevenue += totalRevenue;
  let mostOrderedItem = Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b, '');

  if (type === 'bartender') {
    document.querySelector('.bartenderstat-container h3:nth-of-type(1)').innerText = `Rendelt italok száma: ${totalOrders} db`;
    document.querySelector('.bartenderstat-container h3:nth-of-type(2)').innerText = `Rendelések száma: ${totalOrderCount} db`;
    document.querySelector('.bartenderstat-container h3:nth-of-type(3)').innerText = `Legtöbbet rendelt ital: ${mostOrderedItem}`;
    document.querySelector('.bartenderstat-container h3:nth-of-type(4)').innerText = `Teljes bevétel: ${totalRevenue} HUF`;
  } 
  else if (type === 'foodserver') {
    document.querySelector('.foodserverstat-container h3:nth-of-type(1)').innerText = `Rendelt ételek száma: ${totalOrders} db`;
    document.querySelector('.foodserverstat-container h3:nth-of-type(2)').innerText = `Rendelések száma: ${totalOrderCount} db`;
    document.querySelector('.foodserverstat-container h3:nth-of-type(3)').innerText = `Legtöbbet rendelt étel: ${mostOrderedItem}`;
    document.querySelector('.foodserverstat-container h3:nth-of-type(4)').innerText = `Teljes bevétel: ${totalRevenue} HUF`;
  }

  document.querySelector('.statsummary-container h3:nth-of-type(1)').innerText = `Rendelt italok/ételek száma: ${sumOrders} db`;
  document.querySelector('.statsummary-container h3:nth-of-type(2)').innerText = `Rendelések száma: ${sumOrderCount} db`;
  document.querySelector('.statsummary-container h3:nth-of-type(3)').innerText = `Teljes bevétel: ${sumRevenue} HUF`;  

}