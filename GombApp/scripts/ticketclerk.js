// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
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

document.getElementById('order-save1').addEventListener('click', saveOrder);
document.getElementById('order-save2').addEventListener('click', saveOrder);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

const backButton = document.getElementById('back-button');
const backButton2 = document.getElementById('back-button2');
const orderButton = document.getElementById('order-button');
const fixedBottom = document.getElementById('fixed-bottom');
const menu = document.querySelector('.menu');
const orderList = document.getElementById('order-list-container');

backButton.addEventListener('click', function() {
    window.location.href = 'index.html';
});

backButton2.addEventListener('click', function() {
    fixedBottom.style.display = 'flex';
    orderList.style.display = 'none';
    menu.style.display = 'grid';
    backButton2.style.display = 'none';
    backButton.style.display = 'block';
});

orderButton.addEventListener('click', function() {
    fixedBottom.style.display = 'none';
    orderList.style.display = 'flex';
    menu.style.display = 'none';
    backButton2.style.display = 'block';
    backButton.style.display = 'none';
});

const getInputVal = (id) => {
    return document.getElementById(id).value;
}

document.querySelectorAll('.type-button').forEach(button => {
    button.addEventListener('click', () => {
        const ticket = button.getAttribute('data-type');
        addOrderItem(ticket);
    });
});

let prices = {};
fetchPrices().then(fetchedPrices => {
    prices = fetchedPrices;
});

function addOrderItem(ticket) {
    var orderList = document.getElementById('order-list');
    var listItem = document.createElement('li');
    
    var ticketName = document.createElement('span');
    ticketName.textContent = ticket;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    listItem.className = 'order-list-item';
    deleteButton.addEventListener('click', () => {
        listItem.remove();
        updateTotalPrice();
    });

    listItem.appendChild(ticketName);
    listItem.appendChild(deleteButton);
    orderList.appendChild(listItem);
    
    updateTotalPrice();
}

function fetchPrices() {
    return get(ref(database, 'Árak/Jegy')).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.error("Nem található a jegytípus ára!");
            return {};
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
        return {};
    });
}

function updateTotalPrice() {
    let totalPrice = 0;
    const orderList = Array.from(document.getElementById('order-list').children);
    orderList.forEach(item => {
        const ticket = item.querySelector('span').textContent;
        switch (ticket) {
            case 'Bérlet':
                totalPrice += prices.passPrice || 0;
                break;
            case 'Napijegy (péntek)':
                totalPrice += prices.fridayPrice || 0;
                break;
            case 'Napijegy (szombat)':
                totalPrice += prices.saturdayPrice || 0;
                break;
            case 'Napijegy (vasárnap)':
                totalPrice += prices.sundayPrice || 0;
                break;
            default:
                console.warn(`Unknown ticket type: ${ticket}`);
            break;
        }
    });
    document.getElementById('total-price2').textContent = `Teljes ár: ${totalPrice} Ft`;
}

function saveOrder(e) {
    e.preventDefault();
    if (document.getElementById('order-list').children.length === 0) {
        alert('Adj hozzá legalább egy jegytípust a rendeléshez!');
        return;
    }
    onAuthStateChanged(auth, (user) => {
        if (user) {
            var orderList = document.getElementById('order-list');
            var newOrders = Array.from(orderList.children).map(item => item.querySelector('span').textContent);
            var email = user.email;
            const uid = user.uid;
            const userOrderRef = ref(database, 'Rendelések/Jegy/' + uid);

            fetchPrices().then(prices => {
                let totalPrice = 0;
                let orderPrices = [];

                newOrders.forEach(ticket => {
                    let ticketPrice = 0;
                    switch (ticket) {
                      case 'Bérlet':
                          ticketPrice = prices.passPrice || 0;
                          break;
                      case 'Napijegy (péntek)':
                          ticketPrice = prices.fridayPrice || 0;
                          break;
                      case 'Napijegy (szombat)':
                          ticketPrice = prices.saturdayPrice || 0;
                          break;
                      case 'Napijegy (vasárnap)':
                          ticketPrice = prices.sundayPrice || 0;
                          break;
                      default:
                          console.warn(`Unknown ticket type: ${ticket}`);
                      break;
                  }
                    totalPrice += ticketPrice;
                    orderPrices.push(ticketPrice);
                });

                get(userOrderRef).then((snapshot) => {
                    let existingOrders = [];
                    let existingOrderPrices = [];
                    let existingTotalPrice = 0;
                    let existingOrderCount = 0;
                    if (snapshot.exists()) {
                        existingOrders = snapshot.val().orderList || [];
                        existingOrderPrices = snapshot.val().orderPrices || [];
                        existingTotalPrice = snapshot.val().totalPrice || 0;
                        existingOrderCount = snapshot.val().orderCount || 0;
                    }

                    const updatedOrders = existingOrders.concat(newOrders);
                    const updatedOrderPrices = existingOrderPrices.concat(orderPrices);
                    const updatedTotalPrice = existingTotalPrice + totalPrice;
                    const updatedOrderCount = existingOrderCount + 1;

                    set(userOrderRef, {
                        email: email,
                        orderList: updatedOrders,
                        orderPrices: updatedOrderPrices,
                        totalPrice: updatedTotalPrice,
                        orderCount: updatedOrderCount
                    }).then(() => {
                        alert('Sikeresen mentve!');
                    }).catch((error) => {
                        console.error("Error saving data:", error);
                        alert("Hiba történt az adatok mentése közben.");
                    });

                    orderList.innerHTML = '';
                    document.getElementById('total-price2').textContent = `Teljes ár: 0 Ft`;
                }).catch((error) => {
                    console.error("Error reading data:", error);
                    alert("Hiba történt az adatok olvasása közben.");
                });
            });
        } else {
            alert('Kérjük, jelentkezzen be a mentéshez.');
        }
    });
}