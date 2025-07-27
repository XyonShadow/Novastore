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
    variants: item.variants,
    currency: currentCurrency
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

/**
 * Creates and stores receipt data globally for later use
 * Generates HTML receipt from order details 
 * @param {Object} order - Order object containing items array
 * @param {string} orderId - Unique order identifier
 * @param {string} timeId - Order creation timestamp
 * @param {number} total - Total order amount
 * @param {string} currency - Currency code (usd, eur, ngn, gbp)
 */
// Generates HTML receipt from order details and stores in window.receiptData
function createReceiptData(order, orderId, timeId, total, currency) {
  const currencyMap = {
    'usd': '$', 'eur': '€', 'ngn': '₦', 'gbp': '£'
  };
  const symbol = currencyMap[currency.toLowerCase()] || '₦';

  const receiptHTML = `
    <div class="receipt-container">
      <div class="receipt-header">
        <h1 class="receipt-title">NovaStore</h1>
        <p class="receipt-subtitle">Order Receipt</p>
        <p class="receipt-info">Order #${orderId}</p>
        <p class="receipt-info">Date: ${timeId}</p>
      </div>

      <div class="receipt-items-header">
        <span>Item</span>
        <span>Amount</span>
      </div>

      <div class="receipt-items-section">
        ${order.items.map(item => {
          const itemTotal = item.price * item.quantity;
          return `
            <div class="receipt-item">
              <div class="receipt-item-row">
                <div class="receipt-item-details">
                  <div class="receipt-item-name">${item.name}</div>
                  ${item.variants ? `<div class="receipt-item-variants">${Object.values(item.variants).join(' / ')}</div>` : ''}
                  <div class="receipt-item-qty">Qty: ${item.quantity} × ${symbol}${item.price.toLocaleString()}</div>
                </div>
                <div class="receipt-item-amount">
                  ${symbol}${itemTotal.toLocaleString()}
                </div>
              </div>
              <div class="receipt-item-divider"></div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="receipt-total-section">
        <div class="receipt-total-row">
          <span>TOTAL:</span>
          <span>${symbol}${total.toLocaleString()}</span>
        </div>
      </div>

      <div class="receipt-footer">
        <p>Thank you for shopping with NovaStore!</p>
        <p>Questions? Contact prncemk11@gmail.com</p>
      </div>
    </div>
  `;

  window.receiptData = {
    html: receiptHTML,
    orderId: orderId,
    filename: `NovaStore_Receipt_${orderId}.pdf`
  };
}

/*
 * Loads an order by ID and displays it in the given container IDs
 * @param {string} orderId - The Firestore order ID
 * @param {object} options - DOM element IDs to target
*/

// to load Order Details
async function loadOrderDetails(orderId, options = {}) {
  const {
    productsContainerId = "orderedProducts",
    totalId = "orderTotal",
    timeId = "orderTime"
  } = options;

  if (!document.getElementById(productsContainerId)) {
    return console.warn("Missing container element");
  }

  const orderRef = doc(db, "orders", orderId);

  try {
    const docSnap = await getDoc(orderRef);

    if (!docSnap.exists()) {
      document.getElementById(productsContainerId).textContent = "Order not found!";
      return;
    }

    const order = docSnap.data();
    const items = order.items || [];
    let total = 0;

    const container = document.getElementById(productsContainerId);
    container.innerHTML = "";

    // Currency symbols for display
    const currencySymbols = {
      'usd': '$',
      'eur': '€',
      'ngn': '₦', 
      'gbp': '£'
    };

    items.forEach(item => {
      const { name, quantity, price, variants, currency } = item;
      
      const symbol = currencySymbols[currency] || '₦';
      const itemTotal = price * quantity;
      total += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.className = "order-item";
      itemDiv.innerHTML = `
        <div style="flex: 1">
          <strong style="color: var(--text-main);">${name}</strong><br>
          <small style="color: var(--text-muted);">${variants ? `${Object.values(variants).join("/")}` : ''}</small><br>
          <small style="color: var(--text-accent);">Qty: ${quantity} × ${symbol}${price.toLocaleString()}</small>
        </div>
      `;

      container.appendChild(itemDiv);
    });

    // Display total
    const firstCurrency = items[0]?.currency || 'ngn';
    const totalSymbol = currencySymbols[firstCurrency] || '₦';
    document.getElementById(totalId).innerHTML = `${totalSymbol}${total.toLocaleString()}`;

    // Display time
    let timeValue = '';
    if (order.createdAt?.toDate) {
      timeValue = order.createdAt.toDate().toLocaleString();
      document.getElementById(timeId).textContent = timeValue;
    }

    // Create receipt data
    createReceiptData(order, orderId, timeValue, total, firstCurrency);
  } catch (err) {
    document.getElementById(productsContainerId).textContent = "Error loading order. Please try again.";
    console.error("Failed to fetch order:", err);
  }
}

// Expose to non-module scripts
window.loadOrderDetails = loadOrderDetails;