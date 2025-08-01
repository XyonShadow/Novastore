import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Globals
const excludedPages = ['login.html', 'register.html'];
const isExcluded = excludedPages.some(page => window.location.href.includes(page));

// To check if user is admin
async function checkUserRole(user) {
  const userDocRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    return data.role === "admin";
  } else {
    return false;
  }
}

// Redirect after login/signup
async function handleRedirect() {
  const user = auth.currentUser;
  if (user) {
    const isAdmin = await checkUserRole(user);
    if (isAdmin) {
      console.log('im called')
      window.location.href = "admin.html";
      return;
    }
  }

  if (isExcluded) {
    setTimeout(() => {
      const referrer = document.referrer;
      const isSameOrigin = referrer && referrer.includes(window.location.origin);
      const isAuthPage = referrer?.includes("login.html") || referrer?.includes("register.html");

      if (isSameOrigin && !isAuthPage) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    }, 1500);
  } else {
    closeModals?.();
  }
}

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoadingState(".login-btn", true);

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const rememberMe = document.getElementById("rememberMe").checked;

  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;

  try {
    await setPersistence(auth, persistence);
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    showNotification("Welcome back " + (userCred.user.displayName || userCred.user.email));
    loginForm.reset();
    handleRedirect();
  } catch (err) {
    showNotification("Login error: " + err.message);
  } finally {
    setLoadingState(".login-btn", false);
  }
});

// GOOGLE LOGIN
document.getElementById("googleLoginBtn")?.addEventListener("click", () => {
  setLoadingState('.social-btn', true);
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      showNotification(`Welcome ${user.displayName || 'User'}`);
      window.location.href = "index.html";
    })
    .catch((error) => {
      showNotification("Google login failed: " + error.message);
    })
    .finally(() => {
      setLoadingState('.social-btn', false);
    });
});

// LOGOUT
document.getElementById("logout-btn")?.addEventListener("click", () => {
  signOut(auth)
    .then(() => showNotification("User logged out"))
    .catch((err) => {
      showNotification("Logout error: " + err.message);
    });
});

// FORGOT PASSWORD
document.getElementById("forgotPassword")?.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  if (!email) return showNotification("Please enter your email first.");

  setLoadingState(".login-btn", true);

  sendPasswordResetEmail(auth, email)
    .then(() => showNotification("Password reset email sent."))
    .catch((err) => showNotification("Reset error: " + err.message))
    .finally(() => setLoadingState(".login-btn", false));
});

// VALIDATION UTILITIES
const validators = {
  nickname: (val) => /^[\w]{3,20}$/.test(val),
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  password: (val) => val.length >= 8,
  confirmPassword: (val) => val === document.getElementById('signupPassword').value
};

function validateField(fieldId, errorId, validator, errorMessage) {
  const field = document.getElementById(fieldId);
  const errorDiv = document.getElementById(errorId);
  const isValid = validator(field.value);

  field.classList.toggle('input-error', !isValid);
  field.classList.toggle('input-success', isValid);
  errorDiv.textContent = !isValid ? errorMessage : "";
  errorDiv.classList.toggle('visible', !isValid);

  return isValid;
}

// PASSWORD STRENGTH
function checkPasswordStrength(password) {
  const strengthIndicator = document.getElementById('passwordStrength');
  const strengthText = document.getElementById('strengthText');
  if (!password) return strengthIndicator.style.display = 'none';

  strengthIndicator.style.display = 'block';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const classes = ['strength-weak', 'strength-medium', 'strength-strong'];
  strengthIndicator.classList.remove(...classes);

  let level = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
  strengthIndicator.classList.add(`strength-${level}`);
  strengthText.innerHTML = `Password strength: <span>${level.charAt(0).toUpperCase() + level.slice(1)}</span>`;
}

// Real-Time Validation
document.getElementById('signupNickname')?.addEventListener('input', () => {
  validateField('signupNickname', 'nicknameError', validators.nickname, 'Nickname must be 3-20 characters')
});

document.getElementById('signupEmail')?.addEventListener('input', () => {
  validateField('signupEmail', 'emailError', validators.email, 'Enter a valid email')
});

document.getElementById('signupPassword')?.addEventListener('input', function () {
  checkPasswordStrength(this.value);
  validateField('signupPassword', 'passwordError', validators.password, 'Password too short');

  const confirmPassword = document.getElementById('signupConfirmPassword');
  if (confirmPassword.value) {
    validateField('signupConfirmPassword', 'confirmPasswordError', validators.confirmPassword, 'Passwords do not match');
  }
});

document.getElementById('signupConfirmPassword')?.addEventListener('input', () => {
  validateField('signupConfirmPassword', 'confirmPasswordError', validators.confirmPassword, 'Passwords do not match')
});

// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setLoadingState(".login-btn", true);

  const nickname = document.getElementById("signupNickname").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const agreeTerms = document.getElementById("agreeTerms").checked;

  let isValid =
    validateField('signupNickname', 'nicknameError', validators.nickname, 'Nickname must be 3-20 characters, no spaces') &&
    validateField('signupEmail', 'emailError', validators.email, 'Invalid email format') &&
    validateField('signupPassword', 'passwordError', validators.password, 'Password must be at least 8 characters') &&
    validateField('signupConfirmPassword', 'confirmPasswordError', validators.confirmPassword, 'Passwords do not match');

  if (!agreeTerms) {
    termsError.textContent = 'You must agree to the terms';
    termsError.style.display = 'block';
    isValid = false;
  }

  if (!isValid) {
    showNotification('Fix errors above', 'error');
    setLoadingState(".login-btn", false);
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCred.user, { displayName: nickname });
    showNotification("Signup successful. Welcome " + nickname);
    signupForm.reset();
    handleRedirect();
  } catch (err) {
    showNotification("Signup error: " + err.message);
  } finally {
    setLoadingState(".login-btn", false);
  }
});

// Auth State Handler
window.authChecked = false;
onAuthStateChanged(auth, async (user) => {
  window.currentUser = user;
  authChecked = true;

  if (!isExcluded) {
    document.getElementById("userNickname").textContent = user?.displayName || "Guest";
    document.getElementById("openLoginModal").style.display = user ? "none" : "block";
    document.getElementById("openSignupModal").style.display = user ? "none" : "block";
    document.getElementById("logout-btn").style.display = user ? "block" : "none";
    document.getElementById("viewOrdersLink").style.display = user ? "block" : "none";
  }

  document.documentElement.classList.remove("loading");
});

// Prevent UI from getting stuck if Firebase auth fails
setTimeout(() => {
  if (!window.authChecked) {
    console.log("Firebase auth check did not complete.");
    document.documentElement.classList.remove('loading'); // prevent infinite loading
  }
}, 5000);

// Waits for Firebase Auth to determine the current user and resolves with the user object
window.waitForUserAuth = () =>{
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe(); // stop listening after first result
      resolve(user);
    });
  });
}

// for checkout functionality
function sendCheckoutToFirestore() {
  const items = window.checkedOutItems;
  const user = auth.currentUser;

  setLoadingState(".checkout-btn", true); // Start loading

  if (!user) {
    showNotification("Login required to complete checkout");
    setLoadingState(".checkout-btn", false);
    return;
  }

  if (!items || items.length === 0) {
    showNotification("No items to checkout");
    setLoadingState(".checkout-btn", false);
    return;
  }

  const orderData = items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.discount > 0
      ? convertPrice(item.originalPrice - (item.originalPrice * item.discount) / 100)
      : convertPrice(item.price),
    variants: item.variants,
    currency: currentCurrency
  }));

  addDoc(collection(db, "orders"), {
    userId: user.uid,
    email: user.email,
    items: orderData,
    createdAt: serverTimestamp()
  })
  .then(async (orderRef) => {
    const orderId = orderRef.id;

    // Save orderId inside the document
    await updateDoc(doc(db, "orders", orderId), { orderId });

    const orderSnap = await getDoc(doc(db, "orders", orderId));
    const orderData = orderSnap.data();
    const createdAt = orderData.createdAt?.toDate().toISOString() || new Date().toISOString();

    // Save to localStorage with timestamp
    let orderHistory = JSON.parse(localStorage.getItem("userOrderIds")) || [];
    orderHistory.push({ orderId, createdAt });
    localStorage.setItem("userOrderIds", JSON.stringify(orderHistory));

    showNotification("Order submitted!");
    window.checkedOutItems.forEach(selected => {
      const index = cart.findIndex(item => item.id === selected.id);
      // animate items going out
      if (index !== -1) {
        const itemElement = document.getElementById('cartItems').getElementsByClassName('cart-product')[index];
        itemElement?.classList.add('slide-out');
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
    showNotification("Failed to submit order.");
  })
  .finally(() => {
    setLoadingState(".checkout-btn", false);
  });
}

// Make it accessible globally so script.js can trigger it
window.sendCheckoutToFirestore = sendCheckoutToFirestore;

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

// Loads an order by ID and displays it in the given container IDs
async function loadOrderDetails(orderId, options = {}) {
  // add check for invalid or missing orderId
  if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
    showNotification("⚠️ No valid order ID provided to load order details.");
    return;
  }

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
    if(document.getElementById(totalId)) document.getElementById(totalId).innerHTML = `${totalSymbol}${total.toLocaleString()}`;

    // Display time
    let timeValue = '';
    if (order.createdAt?.toDate) {
      timeValue = order.createdAt.toDate().toLocaleString();
      if(document.getElementById(timeId)) document.getElementById(timeId).textContent = timeValue;
    }

    // Create receipt data
    createReceiptData(order, orderId, timeValue, total, firstCurrency);
  } catch (err) {
    document.getElementById(productsContainerId).textContent = "Error loading order. Please try again.";
    console.error("Failed to fetch order:", err);
  }
}

// Loads and displays the latest 3 orders for the current user
async function loadOrderHistory(userId, containerId = "orderHistoryList") {
  const container = document.getElementById(containerId);
  if (!container) return console.warn("Missing order history container");

  container.innerHTML = "<p style='font-weight: 600;'>Loading your orders...</p>";

  try {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const querySnapshot = await getDocs(q);
    container.innerHTML = "";

    if (querySnapshot.empty) {
      container.innerHTML = "<p>You haven't placed any orders yet.</p>";
      return;
    }

    querySnapshot.forEach(docSnap => {
      const order = docSnap.data();
      const orderId = docSnap.id;
      const items = order.items || [];
      const firstItem = items[0];
      const name = firstItem?.name || "Unnamed Product";
      const initials = name
        .split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const displayId = order.orderId || `#${orderId.slice(0, 8)}`;
      const deliveryDate = order.createdAt?.toDate().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const div = document.createElement("div");
      div.className = "order-item";
      div.innerHTML = `
        <div class="item-image">${initials}</div>
        <div style="flex: 1;">
          <strong style="color: var(--text-main);">${name}</strong> - Order #${displayId}<br>
          <small style="color: var(--text-muted);">Delivered on ${deliveryDate}</small>
        </div>
        <button class="btn btn-secondary" onclick="scrollToId('reviewMessage', 250)">Leave a review</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("Error loading order history:", err);
    container.innerHTML = "<p>Failed to load order history. Please try again later.</p>";
  }
}

// Expose to non-module scripts
window.loadOrderDetails = loadOrderDetails;

// Load order histoy on user verification
window.loadOrderHistory = (containerId = "orderHistoryList") => {
  onAuthStateChanged(auth, user => {
    if (user) {
      loadOrderHistory(user.uid, containerId);
    } else {
      showNotification("User not logged in");
    }
  });
};

// Submits a review for all products in the given order
async function submitReviewForOrder(orderId, rating, comment) {
  const user = auth.currentUser;
  const userId = user.uid;

  try {
    const reviewData = {
      orderId,
      userId,
      rating,
      comment,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'reviews'), reviewData);
  } catch (error) {
    console.error('Error submitting review:', error);
    showNotification('Error submitting review.');
  }
}

// Submit Review function on user verification
window.submitReviewForOrder = submitReviewForOrder;

// Fetch reviews filtered by orderId
async function getReviewsForOrder(orderId) {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('orderId', '==', orderId));
  const snapshot = await getDocs(q);
  const reviews = [];
  snapshot.forEach(doc => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  return reviews;
}

// Expose to non-module scripts
window.getReviewsForOrder = getReviewsForOrder;

// Fetches orders from Firestore for the currently logged-in user
async function getUserOrders() {
  const q = query(collection(db, "orders"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Expose to script.js
window.getUserOrders = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
      if (user) {
        getUserOrders().then(resolve).catch(reject);
      } else {
        showNotification('Log in to view past orders');
        reject("No user logged in");
      }
    });
  });
};