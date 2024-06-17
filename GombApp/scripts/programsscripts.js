const realtimeCal = document.getElementById('realtime');
const agendaCal = document.getElementById('agenda');
const realtimeContainer = document.getElementById('realtime-container');
const agendaContainer = document.getElementById('agenda-container');
const menu = document.getElementById('menu');
const back1 = document.getElementById('back-button1');
const back2 = document.getElementById('back-button2');

realtimeCal.addEventListener('click', function() {
    realtimeContainer.style.display = 'block';
    agendaContainer.style.display = 'none';
    menu.style.display = 'none';
    back1.style.display = 'none';
    back2.style.display = 'block';
});

agendaCal.addEventListener('click', function() {
    agendaContainer.style.display = 'block';
    realtimeContainer.style.display = 'none';
    menu.style.display = 'none';
    back1.style.display = 'none';
    back2.style.display = 'block';
});

back2.addEventListener('click', function() {
    realtimeContainer.style.display = 'none';
    agendaContainer.style.display = 'none';
    menu.style.display = 'grid';
    back1.style.display = 'block';
    back2.style.display = 'none';
});