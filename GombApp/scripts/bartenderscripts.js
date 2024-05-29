// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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

document.getElementById('timeForm').addEventListener('submit', submitForm);
document.getElementById('orderForm').addEventListener('submit', submitOrder);
document.getElementById('order-save').addEventListener('click', saveOrder);

function submitForm(e) {
    e.preventDefault();
    var startTime = getInputVal('start-time');
    var endTime = getInputVal('end-time');
    var email = auth.currentUser.email;
    const uid = auth.currentUser.uid; // TODO: use getToken() instead of uid + check if not null
    set(ref(database, 'Pultosok/' + uid), {
        email: email,
        startTime: startTime,
        endTime: endTime
    }).then(() => {
        alert('Sikeresen mentve!');
        
        // Hide the time container and show the order container
        document.getElementById('time-container').style.display = 'none';
        document.getElementById('order-container').style.display = 'block';
    }).catch((error) => {
        console.error("Error saving data:", error);
        alert("Hiba történt az adatok mentése közben.");
    });
    document.getElementById('timeForm').reset();
}

const getInputVal = (id) => {
    return document.getElementById(id).value;
}

function submitOrder(e) {
    e.preventDefault();
    var drink = getInputVal('drinks');
    addOrderItem(drink);
    document.getElementById('orderForm').reset();
}

function addOrderItem(drink) {
    var orderList = document.getElementById('order-list');
    var listItem = document.createElement('li');
    listItem.textContent = drink;
    orderList.appendChild(listItem);
}

function saveOrder(e) {
    e.preventDefault();
    var orderList = document.getElementById('order-list');
    var email = auth.currentUser.email;
    const uid = auth.currentUser.uid; // TODO: use getToken() instead of uid + check if not null
    set(ref(database, 'Rendelések/' + uid), {
        email: email,
        orderList: orderList.innerText
    }).then(() => {
        alert('Sikeresen mentve!');
        
    }).catch((error) => {
        console.error("Error saving data:", error);
        alert("Hiba történt az adatok mentése közben.");
    });
    orderList.innerHTML = '';
}
