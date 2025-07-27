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

import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


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
      window.location.href = "index.html";
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
    document.getElementById("userNickname").textContent = nickname;
    document.getElementById("openLoginModal").style.display = "none";
    document.getElementById("openSignupModal").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
  } else {
    // User is signed out
    document.getElementById("userNickname").textContent = 'Guest';
    document.getElementById("openLoginModal").style.display = "block";
    document.getElementById("openSignupModal").style.display = "block";
    document.getElementById('logout-btn').style.display = 'none'
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
}, 5000);

// Expose user login check globally
window.isUserLoggedIn = () => auth.currentUser !== null;

// for checkout functionality
function sendCheckoutToFirestore() {
  const items = window.checkedOutItems;
  const user = auth.currentUser;

  if (!user) {
    alert("Login required to complete checkout");
    return;
  }

  if (!items || items.length === 0) {
    alert("No items to checkout");
    return;
  }

  const orderData = items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    variants: item.variants
  }));

  addDoc(collection(db, "orders"), {
    userId: user.uid,
    email: user.email,
    items: orderData,
    createdAt: serverTimestamp()
  })
  // TODO: ADD LOADING FOR DELAYS
  .then(async (orderRef) => {

    const orderId = orderRef.id;

    // Save orderId inside the document
    await updateDoc(doc(db, "orders", orderId), {
      orderId: orderId
    });

    // Save to userOrderIds array
    const orderSnap = await getDoc(doc(db, "orders", orderId));
    const orderData = orderSnap.data();
    const createdAt = orderData.createdAt?.toDate().toISOString() || new Date().toISOString();

    // Save to localStorage with timestamp
    let orderHistory = JSON.parse(localStorage.getItem("userOrderIds")) || [];
    orderHistory.push({
      orderId,
      createdAt
    });
  
    localStorage.setItem("userOrderIds", JSON.stringify(orderHistory));

    alert("Order submitted!");
    window.checkedOutItems.forEach(selected => {
      const index = cart.findIndex(item => item.id === selected.id);
      // animate items going out
      if (index !== -1) {
        const itemElement = document.getElementById('cartItems').getElementsByClassName('cart-product')[index];
        itemElement.classList.add('slide-out');
      }
    });
    window.checkedOutItems = []; // clear items after sending

    // re render and update
    setTimeout(() => {
      cart = cart.filter(item => !item.selected);
      renderCartProducts();
      updateCartStorage();

      // Redirect to thank-you page with order ID
      window.location.href = `thank-you.html?orderId=${orderId}`;
    }, 500);
    console.log("Checkout Items from script.js:", window.checkedOutItems);

  })
  .catch(err => {
    console.error("Error submitting order:", err);
    alert("Failed to submit order.");
  });
}

// Make it accessible globally so script.js can trigger it
window.sendCheckoutToFirestore = sendCheckoutToFirestore;