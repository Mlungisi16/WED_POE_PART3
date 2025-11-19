/* ======== SCRIPT.JS FOR FRESHKICKERS ======== */


  



/* ------------------ COOKIES ------------------ */
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
    }
    return "";
}

function checkCookies() {
    if (!getCookie("acceptedCookies")) {
        const cookieBanner = document.createElement('div');
        cookieBanner.classList.add('cookie-banner');
        cookieBanner.innerHTML = `
            <p>We use cookies to improve your experience. <button onclick="acceptCookies()">Accept</button></p>
        `;
        document.body.appendChild(cookieBanner);
    }
}

function acceptCookies() {
    setCookie("acceptedCookies", "true", 365);
    document.querySelector('.cookie-banner').remove();
}

/* ------------------ LOGIN & SIGNUP ------------------ */

let users = JSON.parse(localStorage.getItem("users")) || [];

function login() {
    const number = document.getElementById('loginNumber').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const user = users.find(u => u.phone === number && u.password === password);

    if (!number || !password) {
        alert("Please fill in all login fields.");
        return;
    }

    if (!user) {
        alert("No account found. Please sign up first.");
        openSignup();
        return;
    }

    alert("Login successful!");
    localStorage.setItem("currentUser", number);
    // Optional: redirect to dashboard
}

function openSignup() {
    const signupOverlay = document.createElement('div');
    signupOverlay.classList.add('signup-overlay');
    signupOverlay.innerHTML = `
        <div class="signup-box">
            <h2>Create Account</h2>
            <input type="text" id="signupName" placeholder="Full Name">
            <input type="tel" id="signupPhone" placeholder="+27 Mobile Number">
            <input type="email" id="signupEmail" placeholder="Email">
            <input type="password" id="signupPassword" placeholder="Strong Password">
            <input type="password" id="signupConfirmPassword" placeholder="Confirm Password">
            <button onclick="signup()">Sign Up</button>
            <button onclick="closeSignup()">Cancel</button>
        </div>
    `;
    document.body.appendChild(signupOverlay);
}

function closeSignup() {
    const overlay = document.querySelector('.signup-overlay');
    if (overlay) overlay.remove();
}

function signup() {
    const name = document.getElementById('signupName').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    const phonePattern = /^\+27\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!name || !phone || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }
    if (!phonePattern.test(phone)) {
        alert("Enter a valid South African phone number (+27XXXXXXXXX).");
        return;
    }
    if (!emailPattern.test(email)) {
        alert("Enter a valid email address.");
        return;
    }
    if (!strongPasswordPattern.test(password)) {
        alert("Password must be at least 8 characters, include uppercase, lowercase, and a number.");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (users.some(u => u.phone === phone || u.email === email)) {
        alert("User already exists.");
        return;
    }

    users.push({name, phone, email, password});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now log in.");
    closeSignup();
}

/* ------------------ SERVICES & PRICE CALC ------------------ */

function showServiceDetails() {
    const serviceType = document.getElementById('serviceType').value;
    document.getElementById('washDetails').style.display = serviceType === 'wash' ? 'block' : 'none';
    document.getElementById('customDetails').style.display = serviceType === 'custom' ? 'block' : 'none';
}

function updatePrice() {
    let basePrice = 0;
    const washType = document.getElementById('washType')?.value;
    const deliveryOption = document.getElementById('deliveryOption')?.value;

    if (washType === 'basic') basePrice = 80;
    else if (washType === 'deep') basePrice = 150;
    else if (washType === 'premium') basePrice = 200;

    if (deliveryOption === 'pickup') basePrice += 50;

    const priceBox = document.getElementById('washPriceBox');
    if (priceBox) priceBox.textContent = `Estimated Price: R${basePrice}`;
}

function submitWash() {
    if (!localStorage.getItem("currentUser")) {
        alert("Please log in to book a service.");
        return;
    }
    const washType = document.getElementById('washType').value;
    const delivery = document.getElementById('deliveryOption').value;
    const address = document.getElementById('washAddress').value;

    alert(`Wash service booked!\nType: ${washType}\nDelivery: ${delivery}\nAddress: ${address}`);
}

function showOtherOption() {
    const designType = document.getElementById('designType').value;
    document.getElementById('otherDesign').style.display = designType === 'other' ? 'block' : 'none';
}

function submitCustom() {
    if (!localStorage.getItem("currentUser")) {
        alert("Please log in to submit a custom design.");
        return;
    }
    const designType = document.getElementById('designType').value;
    const description = document.getElementById('customDescription')?.value;
    const delivery = document.getElementById('customDelivery').value;
    const address = document.getElementById('customAddress').value;

    alert(`Custom design request submitted!\nType: ${designType}\nDescription: ${description || 'N/A'}\nDelivery: ${delivery}\nAddress: ${address}`);
}

/* ------------------ WHATSAPP LIVE CHAT ------------------ */
function addWhatsAppChat() {
    const whatsapp = document.createElement('a');
    whatsapp.href = "https://wa.me/27123456789"; // Replace with your number
    whatsapp.target = "_blank";
    whatsapp.className = "whatsapp-float";
    whatsapp.innerHTML = `<img src="IMAGES/whatsapp-icon.png" alt="Chat on WhatsApp">`;
    document.body.appendChild(whatsapp);
}

/* ------------------ INITIALIZE ------------------ */
document.addEventListener('DOMContentLoaded', () => {
    checkCookies();
    addWhatsAppChat();
});
