// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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

function formatTimestamp(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    const date = timestamp.toDate();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function renderOrderRow(doc) {
    const data = doc.data();
    const orderId = doc.id;
    const user = data.email || 'Anonymous';
    const total = `$${calculateTotal(data.items || []).toFixed(2)}`;
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
loadOrders();