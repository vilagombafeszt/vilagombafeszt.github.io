const lunchButton = document.getElementById('lunch');
const dinnerButton = document.getElementById('dinner');
const backButton = document.getElementById('back-button');

backButton.addEventListener('click', function() {
    if(window.history.length == 0) {
        window.location.href = 'index.html';
    }
    else {
        window.history.back();
    }
});

lunchButton.addEventListener('click', function() {
    window.location.href = 'lunchserver.html';
});

dinnerButton.addEventListener('click', function() {
    window.location.href = 'dinnerserver.html';
});