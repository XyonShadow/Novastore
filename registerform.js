function toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    document.querySelector(".theme-toggle").textContent = next === "light" ? "🌙" : "☀️";
    localStorage.setItem("theme", next);
}

function goBack() {
    const referrer = document.referrer;
    const isSameOrigin = referrer && referrer.includes(window.location.origin);
    const isAuthPage = referrer?.includes("login.html") || referrer?.includes("register.html");

    if (isSameOrigin && !isAuthPage) {
        window.history.back();
    } else {
        window.location.href = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    document.querySelector(".theme-toggle").textContent = saved === "light" ? "🌙" : "☀️";
});

function showNotification(message, type = "success") {
    if(message.includes('error')) type = "error"
    const errBox = document.getElementById("errorMessage");
    const successBox = document.getElementById("successMessage");

    if (type === "error") {
        errBox.textContent = message;
        errBox.style.display = "block";
        successBox.style.display = "none";
    } else {
        successBox.textContent = message;
        successBox.style.display = "block";
        errBox.style.display = "none";
    }

    setTimeout(() => {
        errBox.style.display = "none";
        successBox.style.display = "none";
    }, 5000);
}

function setLoadingState(selector, isLoading, btnElement) {
    let btn;

    if (btnElement) {
        btn = btnElement;
    } else if (selector.startsWith(".")) {
        btn = document.querySelector(selector);
    } else if (selector.startsWith("#")) {
        btn = document.getElementById(selector.slice(1));
    } else {
        btn = document.querySelector("." + selector);
    }
    
    if (!btn) return;

    if (isLoading) {
        btn.classList.add("loading");
        btn.disabled = true;
    } else {
        btn.classList.remove("loading");
        btn.disabled = false;
    }
}