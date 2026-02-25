const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', function() {
  toggleLoginForm();
});


function toggleLoginForm() {
  const loginForm = document.getElementById('login-form');
  const footer = document.querySelector('.footer-text');
  const menu = document.querySelector('.menu');
  loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
  if (loginForm.style.display === 'block') {
    setMenuMarginTo20();
    footer.style.bottom = 'auto';
    footer.style.marginTop = '80px';
    menu.style.paddingTop = '0px';
  } else {
    setMenuMarginTo80();
    footer.style.bottom = '0';
    menu.style.paddingTop = '80px';
  }
}

function setMenuMarginTo80() {
  const menu = document.querySelector('.menu');
  menu.style.marginTop = '80px';
}

function setMenuMarginTo20() {
  const menu = document.querySelector('.menu');
  menu.style.marginTop = '20px';
}

const loggedInMessage = document.getElementById('logged-in-message');
const headerContent = document.querySelector('.header-content');
const appTitle = document.querySelector('.app-title');

function afterLogin() {
  loginButton.style.display = 'none';
  loader.style.display = 'block';
  setTimeout(function() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
    loggedInMessage.style.display = 'block';
  }, 1500);
  headerContent.style.flexDirection = 'column';
  appTitle.style.marginLeft = '0px';
  setMenuMarginTo80();
  const menu = document.querySelector('.menu');
  menu.style.paddingTop = '80px';
}

setTimeout(function() {
  const loader2 = document.getElementById('loader2');
  const messageContent = document.getElementById('message-content');
  loader2.style.display = 'none';
  messageContent.style.display = 'flex';
}, 2000);