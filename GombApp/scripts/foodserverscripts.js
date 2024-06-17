const lunchButton = document.getElementById('lunch');
const dinnerButton = document.getElementById('dinner');

lunchButton.addEventListener('click', function() {
    window.location.href = 'lunchserver.html';
});

dinnerButton.addEventListener('click', function() {
    window.location.href = 'dinnerserver.html';
});