// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Config from Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyDSzADDKNuzg4GpVK7FXIt1O6aH09rCV54",
    authDomain: "novastore-a2f32.firebaseapp.com",
    projectId: "novastore-a2f32",
    storageBucket: "novastore-a2f32.appspot.com",
    messagingSenderId: "605403009737",
    appId: "1:605403009737:web:57e9da118b35eefd52b318"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Check if user is admin
async function protectAdminPage() {
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();

        if (!userDoc.exists() || data.role !== "admin") {
            window.location.href = "index.html";
        }

        if (data.role === "admin") document.documentElement.classList.remove('loading');
    });
}

window.addEventListener("DOMContentLoaded", protectAdminPage);

function formatTimestamp(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    const date = timestamp.toDate();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function renderOrderRow(doc) {
    const data = doc.data();
    const orderId = doc.id;
    const user = data.email || 'Anonymous';
    const totalItems = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = `$${totalItems.toFixed(2)}`;
    const date = formatTimestamp(data.createdAt);

    return `
        <tr>
            <td>${orderId}</td>
            <td>${user}</td>
            <td>${total}</td>
            <td>Pending</td>
            <td>${date}</td>
        </tr>
    `;
}

async function loadOrders() {
    const snapshot = await getDocs(collection(db, 'orders'));
    const tableBody = document.getElementById('orderTableBody');
    tableBody.innerHTML = '';

    snapshot.forEach(doc => {
        tableBody.innerHTML += renderOrderRow(doc);
    });
}

onAuthStateChanged(auth, user => {
    if (!user) {
        // TODO: MAKE ADMIN LOGIN
        // alert('Admins only. Please log in.');
        // location.href = '/login.html';
    } else {
        // loadOrders();
    }
});

const links = document.querySelectorAll("[data-page]");
const main = document.getElementById("admin-content");

async function loadStats() {
    const snapshot = await getDocs(collection(db, 'orders'));

    let totalOrders = 0;
    let totalRevenue = 0;
    let productCount = 0;
    const uniqueUsers = new Set();

    snapshot.forEach(doc => {
        totalOrders++;
        const data = doc.data();

        // Add user
        if (data.email) uniqueUsers.add(data.email);

        // Add products + revenue
        if (data.items && Array.isArray(data.items)) {
            productCount += data.items.length;
            totalRevenue += data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
    });

    // Update DOM
    document.getElementById("stat-orders").textContent = `Total Orders: ${totalOrders}`;
    document.getElementById("stat-revenue").textContent = `Revenue: $${totalRevenue.toFixed(2)}`;
    document.getElementById("stat-products").textContent = `Products: ${productCount}`;
    document.getElementById("stat-users").textContent = `Users: ${uniqueUsers.size}`;
}


async function loadPage(page) {
    const template = document.getElementById(`template-${page}`);
    if (template) {
        main.innerHTML = "";
        const content = template.content.cloneNode(true);
        main.appendChild(content);

        if (page === "dashboard") {
            await loadOrders();
            await loadStats();
        }
    }
}

// Load dashboard by default
loadPage("dashboard");
loadStats();

// Handle sidebar clicks
links.forEach(link => {
    link.addEventListener("click", () => {
        const page = link.dataset.page;
        loadPage(page);
    });
});