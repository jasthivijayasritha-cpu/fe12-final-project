// ===============================
// FOODCARE OWNER SYSTEM
// ===============================


// Get owners
let owners =
    JSON.parse(localStorage.getItem("owners")) || [];


// Get donations
let donations =
    JSON.parse(localStorage.getItem("donations")) || [];


// Current owner
let currentOwner =
    JSON.parse(localStorage.getItem("currentOwner")) || null;


// ===============================
// SAVE DATA
// ===============================

function saveOwners() {

    localStorage.setItem(
        "owners",
        JSON.stringify(owners)
    );
}


function saveDonations() {

    localStorage.setItem(
        "donations",
        JSON.stringify(donations)
    );
}


// ===============================
// SHOW SIGNUP
// ===============================

function showOwnerSignup() {

    document.getElementById("loginBox")
        .style.display = "none";

    document.getElementById("signupBox")
        .style.display = "block";
}


// ===============================
// SHOW LOGIN
// ===============================

function showOwnerLogin() {

    document.getElementById("signupBox")
        .style.display = "none";

    document.getElementById("loginBox")
        .style.display = "block";
}


// ===============================
// OWNER SIGNUP
// ===============================

function ownerSignup() {

    let name =
        document.getElementById(
            "ownerSignupName"
        ).value.trim();


    let email =
        document.getElementById(
            "ownerSignupEmail"
        ).value.trim();


    let phone =
        document.getElementById(
            "ownerSignupPhone"
        ).value.trim();


    let location =
        document.getElementById(
            "ownerSignupLocation"
        ).value.trim();


    let password =
        document.getElementById(
            "ownerSignupPassword"
        ).value;


    let confirmPassword =
        document.getElementById(
            "ownerSignupConfirm"
        ).value;


    // Check empty fields

    if (
        !name ||
        !email ||
        !phone ||
        !location ||
        !password ||
        !confirmPassword
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }


    // Check password

    if (
        password !== confirmPassword
    ) {

        alert(
            "Passwords do not match."
        );

        return;
    }


    // Check existing email

    if (
        owners.some(
            owner =>
                owner.email === email
        )
    ) {

        alert(
            "Email already registered."
        );

        return;
    }


    // Create owner

    let newOwner = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        location: location,

        password: password
    };


    owners.push(newOwner);

    saveOwners();


    alert(
        "Owner account created successfully! 🎉"
    );


    showOwnerLogin();

}


// ===============================
// OWNER LOGIN
// ===============================

function ownerLogin() {

    let email =
        document.getElementById(
            "ownerLoginEmail"
        ).value.trim();


    let password =
        document.getElementById(
            "ownerLoginPassword"
        ).value;


    let owner =
        owners.find(
            item =>
                item.email === email &&
                item.password === password
        );


    if (!owner) {

        alert(
            "Invalid email or password."
        );

        return;
    }


    currentOwner = owner;


    localStorage.setItem(
        "currentOwner",
        JSON.stringify(currentOwner)
    );


    openOwnerDashboard();

}


// ===============================
// OPEN DASHBOARD
// ===============================

function openOwnerDashboard() {

    document.getElementById(
        "authPage"
    ).style.display = "none";


    document.getElementById(
        "ownerDashboard"
    ).style.display = "block";


    document.getElementById(
        "ownerName"
    ).innerText =
        currentOwner.name;


    displayOwnerDonations();

    updateStatistics();

    displayExpiryAlerts();

}


// ===============================
// POST FOOD
// ===============================

document.getElementById(
    "foodForm"
).addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        let foodName =
            document.getElementById(
                "foodName"
            ).value.trim();


        let quantity =
            document.getElementById(
                "foodQuantity"
            ).value;


        let type =
            document.getElementById(
                "foodType"
            ).value;


        let location =
            document.getElementById(
                "foodLocation"
            ).value.trim();


        let expiry =
            document.getElementById(
                "foodExpiry"
            ).value;


        let details =
            document.getElementById(
                "foodDetails"
            ).value.trim();


        // Check expiry

        if (
            new Date(expiry) <=
            new Date()
        ) {

            alert(
                "Expiry time must be in the future."
            );

            return;
        }


        // Create donation

        let donation = {

            id: Date.now(),

            ownerId:
                currentOwner.id,

            owner:
                currentOwner.name,

            ownerEmail:
                currentOwner.email,

            ownerPhone:
                currentOwner.phone,

            food:
                foodName,

            quantity:
                quantity,

            type:
                type,

            location:
                location,

            expiry:
                expiry,

            details:
                details,

            status:
                "Available",

            createdAt:
                new Date().toISOString(),

            claimedBy:
                "",

            claimedEmail:
                "",

            claimedPhone:
                "",

            claimedAt:
                ""

        };


        donations.push(donation);

        saveDonations();


        alert(
            "Food donation posted successfully! 🍱"
        );


        document.getElementById(
            "foodForm"
        ).reset();


        displayOwnerDonations();

        updateStatistics();

        displayExpiryAlerts();

    }
);


// ===============================
// DISPLAY DONATIONS
// ===============================

function displayOwnerDonations() {

    let container =
        document.getElementById(
            "ownerDonations"
        );


    container.innerHTML = "";


    let myDonations =
        donations.filter(
            food =>
                food.ownerId ===
                currentOwner.id
        );


    if (myDonations.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <h3>
                    🍱 No Donations Yet
                </h3>

                <p>
                    Post your first surplus
                    food donation.
                </p>

            </div>

        `;

        return;
    }


    myDonations
        .slice()
        .reverse()
        .forEach(food => {

            let statusClass =
                food.status.toLowerCase();


            let claimedInfo = "";


            if (
                food.status === "Claimed" ||
                food.status === "Distributed"
            ) {

                claimedInfo = `

                    <p>
                        👤
                        <b>Claimed By:</b>
                        ${food.claimedBy}
                    </p>

                    <p>
                        📧
                        ${food.claimedEmail}
                    </p>

                `;
            }


            container.innerHTML += `

                <div class="food-card">

                    <div class="food-icon">
                        🍱
                    </div>

                    <h3>
                        ${food.food}
                    </h3>

                    <p>
                        <b>Quantity:</b>
                        ${food.quantity}
                    </p>

                    <p>
                        <b>Type:</b>
                        ${food.type}
                    </p>

                    <p>
                        📍
                        ${food.location}
                    </p>

                    <p>
                        ⏰
                        ${new Date(food.expiry)
                          .toLocaleString()}
                    </p>

                    <p>
                        ${food.details}
                    </p>

                    ${claimedInfo}

                    <span class="status ${statusClass}">
                        ${food.status}
                    </span>

                </div>

            `;

        });

}


// ===============================
// STATISTICS
// ===============================

function updateStatistics() {

    let myDonations =
        donations.filter(
            food =>
                food.ownerId ===
                currentOwner.id
        );


    let total =
        myDonations.length;


    let active =
        myDonations.filter(
            food =>
                food.status ===
                "Available"
        ).length;


    let claimed =
        myDonations.filter(
            food =>
                food.status ===
                "Claimed"
        ).length;


    let distributed =
        myDonations.filter(
            food =>
                food.status ===
                "Distributed"
        ).length;


    document.getElementById(
        "totalDonations"
    ).innerText = total;


    document.getElementById(
        "activeDonations"
    ).innerText = active;


    document.getElementById(
        "claimedDonations"
    ).innerText = claimed;


    document.getElementById(
        "distributedDonations"
    ).innerText = distributed;

}


// ===============================
// EXPIRY ALERTS
// ===============================

function displayExpiryAlerts() {

    let container =
        document.getElementById(
            "expiryAlerts"
        );


    container.innerHTML = "";


    let myDonations =
        donations.filter(
            food =>
                food.ownerId ===
                currentOwner.id &&
                food.status ===
                "Available"
        );


    let alertFound = false;


    myDonations.forEach(food => {

        let expiry =
            new Date(food.expiry)
            .getTime();


        let now =
            new Date().getTime();


        let difference =
            expiry - now;


        // Already expired

        if (difference <= 0) {

            container.innerHTML += `

                <div class="danger-alert">

                    ❌
                    <b>${food.food}</b>
                    has expired.

                </div>

            `;

            alertFound = true;

        }


        // Expiring within 3 hours

        else if (
            difference <=
            3 * 60 * 60 * 1000
        ) {

            let hours =
                Math.ceil(
                    difference /
                    (60 * 60 * 1000)
                );


            container.innerHTML += `

                <div class="urgent">

                    ⚠️
                    <b>${food.food}</b>
                    is expiring in
                    ${hours} hour(s)!

                    <br>

                    📍
                    ${food.location}

                </div>

            `;

            alertFound = true;

        }

    });


    if (!alertFound) {

        container.innerHTML = `

            <div class="empty">

                ✅
                No urgent expiry alerts.

            </div>

        `;

    }

}


// ===============================
// LOGOUT
// ===============================

function ownerLogout() {

    localStorage.removeItem(
        "currentOwner"
    );

    currentOwner = null;


    document.getElementById(
        "ownerDashboard"
    ).style.display = "none";


    document.getElementById(
        "authPage"
    ).style.display = "flex";

}


// ===============================
// AUTO LOGIN
// ===============================

if (currentOwner) {

    openOwnerDashboard();

}


// ===============================
// CHECK EXPIRY EVERY MINUTE
// ===============================

setInterval(
    function() {

        if (currentOwner) {

            displayExpiryAlerts();

            updateStatistics();

        }

    },
    60000
);