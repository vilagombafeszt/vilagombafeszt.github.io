const backButton = document.getElementById('back-button');

backButton.addEventListener('click', function() {
    if(window.history.length == 0) {
        window.location.href = 'index.html';
    }
    else {
        window.history.back();
    }
});