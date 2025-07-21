import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { auth } from "./firebase.js";

// SIGN UP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nickname = document.getElementById("signupNickname").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: nickname });
      signupForm.reset();
      closeModals();
      alert("Signup successful. Welcome " + nickname);
      window.location.href = "index.html";
    } catch (err) {
      alert("Signup error: " + err.message);
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;

    const persistence = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    try {
      await setPersistence(auth, persistence);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      alert("Welcome back " + (userCred.user.displayName || userCred.user.email));
      loginForm.reset();
      closeModals();
    } catch (err) {
      alert("Login error: " + err.message);
    }
  });
}

// FORGOT PASSWORD
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();

    if (!email) return alert("Please enter your email first.");

    sendPasswordResetEmail(auth, email)
      .then(() => alert("Password reset email sent. Check your inbox."))
      .catch((err) => alert("Reset error: " + err.message));
  });
}

//LOG OUT
document.getElementById("logout-btn").addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      alert("User logged out");
    })
    .catch((error) => {
      alert("Logout error:", error);
    });
});

// checks if user is logged in
let authChecked = false;
onAuthStateChanged(auth, (user) => {
  authChecked = true;
  if (user) {
    const nickname = user.displayName || "User";
    const userNickname = document.getElementById("userNickname");
    userNickname.textContent = nickname;
    document.querySelector('.register-select').style.display = 'none'
    document.getElementById("userGreeting").style.display = "flex";
  } else {
    // User is signed out
    document.getElementById("userGreeting").style.display = "none";
    document.querySelector('.register-select').style.display = 'flex'
  }

// Wait for auth to resolve before revealing UI
  document.documentElement.classList.remove('loading');
});

// Prevent UI from getting stuck if Firebase auth fails
setTimeout(() => {
  if (!authChecked) {
    console.log("Firebase auth check did not complete.");
    document.documentElement.classList.remove('loading'); // prevent infinite loading
  }
}, 3000);
