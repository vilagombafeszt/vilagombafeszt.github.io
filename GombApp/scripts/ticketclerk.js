// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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
const statButton = document.getElementById('stat-button');
const fixedBottom = document.getElementById('fixed-bottom');
const menu = document.querySelector('.menu');
const orderList = document.getElementById('order-list-container');

backButton.addEventListener('click', function() {
    window.location.href = 'index.html';
});

backButton2.addEventListener('click', function() {
    // Hide statistics view if visible
    const statsContainer = document.getElementById('statistics-container');
    if (statsContainer) {
        statsContainer.style.display = 'none';
    }
    
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

statButton.addEventListener('click', function() {
    showStatistics();
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

// Function to count tickets by type
function countTicketsByType(orders) {
    let counts = {
        friday: 0,
        saturday: 0,
        sunday: 0,
        pass: 0
    };
    
    orders.forEach(ticket => {
        switch (ticket) {
            case 'Bérlet':
                counts.pass++;
                break;
            case 'Napijegy (péntek)':
                counts.friday++;
                break;
            case 'Napijegy (szombat)':
                counts.saturday++;
                break;
            case 'Napijegy (vasárnap)':
                counts.sunday++;
                break;
        }
    });
    
    return counts;
}

// Function to update max ticket counts using transactions for atomic operations
function updateMaxTicketCounts(ticketCounts) {
    const promises = [];
    
    // Update Friday max count
    if (ticketCounts.friday > 0 || ticketCounts.pass > 0) {
        const fridayRef = ref(database, 'Jegyek/pentekMax');
        promises.push(
            runTransaction(fridayRef, (currentValue) => {
                const currentMax = currentValue || 0;
                const decrease = ticketCounts.friday + ticketCounts.pass;
                return Math.max(0, currentMax - decrease);
            })
        );
    }
    
    // Update Saturday max count
    if (ticketCounts.saturday > 0 || ticketCounts.pass > 0) {
        const saturdayRef = ref(database, 'Jegyek/szombatMax');
        promises.push(
            runTransaction(saturdayRef, (currentValue) => {
                const currentMax = currentValue || 0;
                const decrease = ticketCounts.saturday + ticketCounts.pass;
                return Math.max(0, currentMax - decrease);
            })
        );
    }
    
    // Update Sunday max count
    if (ticketCounts.sunday > 0 || ticketCounts.pass > 0) {
        const sundayRef = ref(database, 'Jegyek/vasarnapMax');
        promises.push(
            runTransaction(sundayRef, (currentValue) => {
                const currentMax = currentValue || 0;
                const decrease = ticketCounts.sunday + ticketCounts.pass;
                return Math.max(0, currentMax - decrease);
            })
        );
    }
    
    return Promise.all(promises);
}

// Function to fetch max ticket counts from database
function fetchMaxTicketCounts() {
    const promises = [
        get(ref(database, 'Jegyek/pentekMax')),
        get(ref(database, 'Jegyek/szombatMax')),
        get(ref(database, 'Jegyek/vasarnapMax'))
    ];
    
    return Promise.all(promises).then(snapshots => {
        return {
            friday: snapshots[0].exists() ? snapshots[0].val() : 0,
            saturday: snapshots[1].exists() ? snapshots[1].val() : 0,
            sunday: snapshots[2].exists() ? snapshots[2].val() : 0
        };
    }).catch(error => {
        console.error("Error fetching max ticket counts:", error);
        return { friday: 0, saturday: 0, sunday: 0 };
    });
}

// Function to show statistics
function showStatistics() {
    // Hide all other elements
    fixedBottom.style.display = 'none';
    orderList.style.display = 'none';
    menu.style.display = 'none';
    
    // Show back button 2
    backButton2.style.display = 'block';
    backButton.style.display = 'none';
    
    // Create or show statistics container
    let statsContainer = document.getElementById('statistics-container');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.id = 'statistics-container';
        statsContainer.className = 'statistics-container';
        document.querySelector('main .order-container').appendChild(statsContainer);
    }
    
    statsContainer.innerHTML = '<div class="loading">Statisztika betöltése...</div>';
    statsContainer.style.display = 'flex';
    
    // Fetch and display max ticket counts
    fetchMaxTicketCounts().then(maxCounts => {
        const fridayBorderColor = maxCounts.friday === 0 ? '#d32f2f' : '#4CAF50';
        const saturdayBorderColor = maxCounts.saturday === 0 ? '#d32f2f' : '#4CAF50';
        const sundayBorderColor = maxCounts.sunday === 0 ? '#d32f2f' : '#4CAF50';
        
        statsContainer.innerHTML = `
            <div class="statistics-content">
                <h2>Jegy Statisztikák</h2>
                <div class="stat-item" style="border-left-color: ${fridayBorderColor};">
                    <div class="stat-day">Péntek</div>
                    <div class="stat-count">Elérhető helyek: ${maxCounts.friday}</div>
                </div>
                <div class="stat-item" style="border-left-color: ${saturdayBorderColor};">
                    <div class="stat-day">Szombat</div>
                    <div class="stat-count">Elérhető helyek: ${maxCounts.saturday}</div>
                </div>
                <div class="stat-item" style="border-left-color: ${sundayBorderColor};">
                    <div class="stat-day">Vasárnap</div>
                    <div class="stat-count">Elérhető helyek: ${maxCounts.sunday}</div>
                </div>
            </div>
        `;
    }).catch(error => {
        statsContainer.innerHTML = `
            <div class="statistics-content">
                <h2>Jegy Statisztikák</h2>
                <div class="error">Hiba történt az adatok betöltése közben.</div>
            </div>
        `;
    });
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

                    // Count tickets by type for max count updates
                    const ticketCounts = countTicketsByType(newOrders);

                    // Save user order and update max counts simultaneously
                    Promise.all([
                        set(userOrderRef, {
                            email: email,
                            orderList: updatedOrders,
                            orderPrices: updatedOrderPrices,
                            totalPrice: updatedTotalPrice,
                            orderCount: updatedOrderCount
                        }),
                        updateMaxTicketCounts(ticketCounts)
                    ]).then(() => {
                        alert('Sikeresen mentve!');
                        orderList.innerHTML = '';
                        document.getElementById('total-price2').textContent = `Teljes ár: 0 Ft`;
                    }).catch((error) => {
                        console.error("Error saving data:", error);
                        alert("Hiba történt az adatok mentése közben.");
                    });

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