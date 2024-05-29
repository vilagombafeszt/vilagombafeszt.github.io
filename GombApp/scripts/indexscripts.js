function toggleLoginForm() {
  const loginForm = document.getElementById('login-form');
  loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
  if (loginForm.style.display === 'block') {
    setMenuMarginTo20();
  } else {
    setMenuMarginTo80();
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

const loginButton = document.querySelector('.login-button');
const loggedInMessage = document.getElementById('logged-in-message');
const headerContent = document.querySelector('.header-content');
const appTitle = document.querySelector('.app-title');

function afterLogin() {
  loginButton.style.display = 'none';
  loggedInMessage.style.display = 'block';
  headerContent.style.flexDirection = 'column';
  appTitle.style.marginLeft = '0px';
  setMenuMarginTo80();
}