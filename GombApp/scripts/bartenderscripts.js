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

document.getElementById('order-save').addEventListener('click', saveOrder);

const getInputVal = (id) => {
    return document.getElementById(id).value;
}

document.querySelectorAll('.drink-button').forEach(button => {
    button.addEventListener('click', () => {
        const drink = button.getAttribute('data-drink');
        addOrderItem(drink);
    });
});

function addOrderItem(drink) {
    var orderList = document.getElementById('order-list');
    var listItem = document.createElement('li');
    listItem.textContent = drink;
    orderList.appendChild(listItem);
}


function saveOrder(e) {
    e.preventDefault();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            var orderList = document.getElementById('order-list');
            var newOrders = Array.from(orderList.children).map(item => item.textContent);
            var email = user.email;
            const uid = user.uid;
            const userOrderRef = ref(database, 'Rendelések/' + uid);

            get(userOrderRef).then((snapshot) => {
                let existingOrders = [];
                if (snapshot.exists()) {
                    existingOrders = snapshot.val().orderList || [];
                }

                const updatedOrders = existingOrders.concat(newOrders);

                set(userOrderRef, {
                    email: email,
                    orderList: updatedOrders
                }).then(() => {
                    alert('Sikeresen mentve!');
                }).catch((error) => {
                    console.error("Error saving data:", error);
                    alert("Hiba történt az adatok mentése közben.");
                });

                orderList.innerHTML = '';
            }).catch((error) => {
                console.error("Error reading data:", error);
                alert("Hiba történt az adatok olvasása közben.");
            });
        } else {
            alert('Kérjük, jelentkezzen be a mentéshez.');
        }
    });
}