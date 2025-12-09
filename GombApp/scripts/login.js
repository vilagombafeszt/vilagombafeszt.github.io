// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, fetchSignInMethodsForEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { showSnackbar, showConfirmSnackbar } from "./snackbar.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const submitButton = document.getElementById('submit-button');
const forgotPasswordButton = document.getElementById('forgot-password');
const sendLinkButton = document.getElementById('send-link-button');
const loginFields = document.getElementById('login-fields');
const forgotPasswordFields = document.getElementById('forgot-password-fields');
const resetEmailInput = document.getElementById('reset-email');
const cancelButtonInForm = document.getElementById('cancel-button');
const backToLoginButton = document.getElementById('back-to-login');

// Only wire up login form logic on pages where the form exists
if (submitButton && forgotPasswordButton && sendLinkButton && loginFields && forgotPasswordFields) {  
  function showResetView() {
    loginFields.style.display = 'none';
    forgotPasswordFields.style.display = 'block';
  }

  function showLoginView() {
    loginFields.style.display = 'flex';
    forgotPasswordFields.style.display = 'none';
  }

  if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener('click', function(event) {
      event.preventDefault();
      showResetView();
    });
  }

  if (backToLoginButton) {
    backToLoginButton.addEventListener('click', function(event) {
      event.preventDefault();
      showLoginView();
    });
  }

  if (cancelButtonInForm) {
    cancelButtonInForm.addEventListener('click', function() {
      // Close the whole login form
      const loginForm = document.getElementById('login-form');
      const footer = document.querySelector('.footer-text');
      loginForm.style.display = 'none';
      const menu = document.querySelector('.menu');
      menu.style.marginTop = '80px';
      footer.style.bottom = '0';
      // Ensure next open starts from login view
      showLoginView();
    });
  }

  if (sendLinkButton) {
    sendLinkButton.addEventListener('click', function(event) {
      event.preventDefault();
      const email = resetEmailInput ? resetEmailInput.value.trim() : '';
      if (!email) {
        showSnackbar('Kérjük, add meg az e-mail-címedet!', 'info');
        return;
      }
      
      // Send password reset email - Firebase will handle whether account exists
      sendPasswordResetEmail(auth, email)
        .then(() => {
          showSnackbar('Ha ez az e-mail cím regisztrálva van, küldtünk rá egy hivatkozást.', 'success');
        })
        .catch((error) => {
          // Check for specific error codes
          if (error.code === 'auth/user-not-found') {
            showSnackbar('Nincs regisztrált fiók ezzel az e-mail-címmel.', 'error');
          } else if (error.code === 'auth/invalid-email') {
            showSnackbar('Érvénytelen e-mail cím formátum.', 'error');
          } else {
            showSnackbar(error.message, 'error');
          }
        });
    });
  }

  submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    // Inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showSnackbar('Kérjük, töltsd ki az összes mezőt!', 'info');
      return;
    }
    
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      showSnackbar('Sikeres bejelentkezés!', 'success');
        // Close the login form
        const loginForm = document.getElementById('login-form');
        loginForm.style.display = 'none';
        location.reload();
    }).catch((error) => {
        const errorCode = error.code;
        
        // Translate Firebase errors to user-friendly Hungarian messages
        let errorMessage = 'Hiba történt a bejelentkezés során.';
        
        switch(errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'Érvénytelen e-mail cím formátum.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Ez a fiók le lett tiltva.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Nem található ilyen felhasználó.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Hibás jelszó.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Hibás e-mail cím vagy jelszó.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Túl sok sikertelen próbálkozás. Kérjük, próbáld újra később.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Hálózati hiba. Ellenőrizd az internetkapcsolatot.';
            break;
          default:
            errorMessage = 'Bejelentkezési hiba. Ellenőrizd az adataidat.';
        }
        
      showSnackbar(errorMessage, 'error');
    });
  });
}

onAuthStateChanged(auth, (user) => {
    const loginButton = document.getElementById('login-button');
    const loggedInMessage = document.getElementById('logged-in-message');
    const logoutButton = document.getElementById('logout-button');
    const headerContent = document.querySelector('.header-content');
    
    if (user) {
      // User is signed in
      // Show logout button
      if (logoutButton) {
        logoutButton.style.display = 'block';
        logoutButton.addEventListener('click', function() {
          showConfirmSnackbar(
            'Biztosan ki szeretnél jelentkezni?',
            () => {
              // User confirmed
              signOut(auth)
                .then(() => {
                  showSnackbar('Sikeres kijelentkezés!', 'success');
                  location.reload();
                })
                .catch((error) => {
                  showSnackbar('Hiba történt a kijelentkezés során.', 'error');
                });
            },
            () => {
              // User cancelled - do nothing
            }
          );
        });
      }
      
      // Call afterLogin from indexscripts.js if it exists
      if (typeof afterLogin === 'function') {
        afterLogin();
      }
      const bartenderButton = document.getElementById('bartender');
      const ticketClerkButton = document.getElementById('ticket-clerk');
      const programsButton = document.getElementById('programs');
      const adminButton = document.getElementById('admin');
        bartenderButton.addEventListener('click', function() {
            window.location.href = 'bartender.html';
        });
        ticketClerkButton.addEventListener('click', function() {
            window.location.href = 'ticketclerk.html';
        });
        programsButton.addEventListener('click', function() {
          window.location.href = 'programs.html';
        });
        adminButton.addEventListener('click', function() {
          const allowedUids = ['9HBKQhxPThQXX51YLwHKGaLiz0D3', 'JlsebVypa1cYKXiLjIns7MktYmy2'];
            if (allowedUids.includes(user.uid)) {
                window.location.href = 'admin.html';
            } else {
            showSnackbar('Nincs jogosultságod az admin oldal megtekintéséhez!', 'error');
            }
        });
    } 
    else {
      // No user is signed in
      if (loginButton) {
        loginButton.style.display = 'block';
      }
      if (loggedInMessage) {
        loggedInMessage.style.display = 'none';
      }
      if (logoutButton) {
        logoutButton.style.display = 'none';
      }
      if (headerContent) {
        headerContent.style.flexDirection = 'row';
      }
      // Call setMenuMarginTo20 from indexscripts.js if it exists
      if (typeof setMenuMarginTo20 === 'function') {
        setMenuMarginTo20();
      }
      const bartenderButton = document.getElementById('bartender');
      const ticketClerkButton = document.getElementById('ticket-clerk');
      const programsButton = document.getElementById('programs');
      const adminButton = document.getElementById('admin');
      if (bartenderButton) {
        bartenderButton.addEventListener('click', function() {
          showSnackbar('Kérlek jelentkezz be!', 'info');
        });
      }
      if (ticketClerkButton) {
        ticketClerkButton.addEventListener('click', function() {
          showSnackbar('Kérlek jelentkezz be!', 'info');
        });
      }
      if (programsButton) {
        programsButton.addEventListener('click', function() {
          showSnackbar('Kérlek jelentkezz be!', 'info');
        });
      }
      if (adminButton) {
        adminButton.addEventListener('click', function() {
          showSnackbar('Kérlek jelentkezz be!', 'info');
        });
      }
    }
  });

