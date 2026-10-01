// ===============================
// FOODCARE USER SYSTEM
// ===============================


// Get users
let users = JSON.parse(localStorage.getItem("users")) || [];

// Get donations
let donations = JSON.parse(localStorage.getItem("donations")) || [];

// Current logged-in user
let currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || null;


// ===============================
// SAVE DATA
// ===============================

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function saveDonations() {
    localStorage.setItem("donations", JSON.stringify(donations));
}


// ===============================
// SHOW SIGNUP
// ===============================

function showSignup() {

    document.getElementById("loginBox").style.display = "none";

    document.getElementById("signupBox").style.display = "block";
}


// ===============================
// SHOW LOGIN
// ===============================

function showLogin() {

    document.getElementById("signupBox").style.display = "none";

    document.getElementById("loginBox").style.display = "block";
}


// ===============================
// SIGN UP
// ===============================

function signupUser() {

    let name =
        document.getElementById("signupName").value.trim();

    let email =
        document.getElementById("signupEmail").value.trim();

    let phone =
        document.getElementById("signupPhone").value.trim();

    let location =
        document.getElementById("signupLocation").value.trim();

    let password =
        document.getElementById("signupPassword").value;

    let confirmPassword =
        document.getElementById("signupConfirm").value;


    if (!name || !email || !phone || !location ||
        !password || !confirmPassword) {

        alert("Please fill all fields.");
        return;
    }


    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;
    }


    if (users.some(user => user.email === email)) {

        alert("Email already registered.");
        return;
    }


    let newUser = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        location: location,

        password: password
    };


    users.push(newUser);

    saveUsers();


    alert(
        "Account created successfully! 📧\n" +
        "You will receive FoodCare notifications on your registered Email/SMS."
    );


    showLogin();

}


// ===============================
// LOGIN
// ===============================

function loginUser() {

    let email =
        document.getElementById("loginEmail").value.trim();

    let password =
        document.getElementById("loginPassword").value;


    let user = users.find(
        u => u.email === email &&
             u.password === password
    );


    if (!user) {

        alert("Invalid email or password.");
        return;
    }


    currentUser = user;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    openDashboard();

}


// ===============================
// OPEN DASHBOARD
// ===============================

function openDashboard() {

    document.getElementById("authPage").style.display = "none";

    document.getElementById("dashboard").style.display = "block";


    document.getElementById("userName").innerText =
        currentUser.name;


    document.getElementById("userLocation").value =
        currentUser.location;


    displayAvailableFood();

    displayClaimHistory();

}


// ===============================
// FIND NEARBY FOOD
// ===============================

function findNearbyFood() {

    let location =
        document.getElementById("userLocation")
        .value
        .trim()
        .toLowerCase();


    if (!location) {

        alert("Please enter your location.");
        return;
    }


    let nearbyFood = donations.filter(food => {

        return food.status === "Available" &&
               food.location.toLowerCase()
               .includes(location);

    });


    displayAvailableFood(nearbyFood);


    if (nearbyFood.length === 0) {

        showNotification(
            "No surplus food found near your location.",
            "warning"
        );

    } else {

        showNotification(
            nearbyFood.length +
            " food donation(s) found near you! 🍱",
            "success"
        );
    }

}


// ===============================
// DISPLAY FOOD
// ===============================

function displayAvailableFood(list = donations) {

    let container =
        document.getElementById("availableFood");

    container.innerHTML = "";


    let available = list.filter(
        food => food.status === "Available"
    );


    if (available.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>🍽️ No Food Available</h3>
                <p>Please check again later.</p>
            </div>
        `;

        return;
    }


    available.forEach(food => {

        let expiryTime =
            new Date(food.expiry).getTime();

        let currentTime =
            new Date().getTime();

        let difference =
            expiryTime - currentTime;


        let alertText = "";


        if (difference <= 3 * 60 * 60 * 1000 &&
            difference > 0) {

            alertText =
                `<div class="urgent">
                    ⚠️ Perishable Food - Expiring Soon
                 </div>`;
        }


        container.innerHTML += `

            <div class="food-card">

                ${alertText}

                <div class="food-icon">
                    🍱
                </div>

                <h3>${food.food}</h3>

                <p>
                    <b>Quantity:</b>
                    ${food.quantity}
                </p>

                <p>
                    <b>Type:</b>
                    ${food.type}
                </p>

                <p>
                    📍 ${food.location}
                </p>

                <p>
                    ⏰ ${new Date(food.expiry)
                        .toLocaleString()}
                </p>

                <p>
                    ${food.details || ""}
                </p>

                <p>
                    <b>Donated by:</b>
                    ${food.owner}
                </p>

                <button
                    class="claim"
                    onclick="claimFood(${food.id})">

                    Claim Food 🍱

                </button>

            </div>
        `;
    });

}


// ===============================
// CLAIM FOOD
// ===============================

function claimFood(id) {

    let food =
        donations.find(item => item.id === id);


    if (!food) {

        alert("Food donation not found.");
        return;
    }


    if (food.status !== "Available") {

        alert("This food has already been claimed.");
        return;
    }


    food.status = "Claimed";

    food.claimedBy =
        currentUser.name;

    food.claimedEmail =
        currentUser.email;

    food.claimedPhone =
        currentUser.phone;

    food.claimedAt =
        new Date().toISOString();


    saveDonations();


    // Simulated email notification
    sendEmailNotification(food);


    // Simulated SMS notification
    sendSMSNotification(food);


    alert(
        "Food claimed successfully! 🍱\n\n" +
        "📧 Email notification sent.\n" +
        "📱 SMS notification sent."
    );


    displayAvailableFood();

    displayClaimHistory();

}


// ===============================
// EMAIL NOTIFICATION
// ===============================

function sendEmailNotification(food) {

    console.log(
        "EMAIL NOTIFICATION"
    );

    console.log(
        "To: " + currentUser.email
    );

    console.log(
        "Food: " + food.food
    );

    console.log(
        "Location: " + food.location
    );

    console.log(
        "Status: Food Claimed Successfully"
    );


    showNotification(
        "📧 Email notification sent to " +
        currentUser.email,
        "success"
    );
}


// ===============================
// SMS NOTIFICATION
// ===============================

function sendSMSNotification(food) {

    console.log(
        "SMS NOTIFICATION"
    );

    console.log(
        "To: " + currentUser.phone
    );

    console.log(
        "Food: " + food.food
    );

    console.log(
        "Status: Food Claimed Successfully"
    );


    setTimeout(() => {

        showNotification(
            "📱 SMS notification sent to " +
            currentUser.phone,
            "success"
        );

    }, 1000);

}


// ===============================
// CLAIM HISTORY
// ===============================

function displayClaimHistory() {

    let container =
        document.getElementById("claimHistory");

    container.innerHTML = "";


    let history =
        donations.filter(
            food =>
                food.claimedEmail ===
                currentUser.email
        );


    if (history.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No claim history yet.
            </div>
        `;

        return;
    }


    history.forEach(food => {

        container.innerHTML += `

            <div class="history-card">

                <h3>🍱 ${food.food}</h3>

                <p>
                    Quantity: ${food.quantity}
                </p>

                <p>
                    📍 ${food.location}
                </p>

                <p>
                    👤 Donor: ${food.owner}
                </p>

                <p>
                    📅 Claimed:
                    ${new Date(food.claimedAt)
                    .toLocaleString()}
                </p>

                <span class="status">
                    ${food.status}
                </span>

            </div>

        `;

    });

}


// ===============================
// NOTIFICATION BOX
// ===============================

function showNotification(message, type) {

    let box =
        document.getElementById("notification");


    box.innerHTML = message;

    box.className =
        "notification " + type;


    setTimeout(() => {

        box.innerHTML = "";

        box.className = "notification";

    }, 4000);

}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("currentUser");

    currentUser = null;


    document.getElementById("dashboard")
        .style.display = "none";

    document.getElementById("authPage")
        .style.display = "flex";

}


// ===============================
// AUTO LOGIN
// ===============================

if (currentUser) {

    openDashboard();

}