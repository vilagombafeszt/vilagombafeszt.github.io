const lunchButton = document.getElementById('lunch');
const dinnerButton = document.getElementById('dinner');
const backButton = document.getElementById('back-button');

backButton.addEventListener('click', function() {
    window.location.href = 'index.html';
});

lunchButton.addEventListener('click', function() {
    window.location.href = 'lunchserver.html';
});

dinnerButton.addEventListener('click', function() {
    window.location.href = 'dinnerserver.html';
});