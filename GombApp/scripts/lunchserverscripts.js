const backButton = document.getElementById('back-button');
const backButton2 = document.getElementById('back-button2');
const orderButton = document.getElementById('order-button');

backButton.addEventListener('click', function() {
    window.location.href = 'foodserver.html';
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