let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const Clicker = document.getElementById('Clicker');
const Oma = document.getElementById('Oma');
const multiplierMouseBtn = document.getElementById('multiplierMouseBtn');
const SpeedBtn = document.getElementById('SpeedyAuto');
let autoClickers = [];
let AutoRate = 10000; // start = 10 sec
const OmaRate = 1000; // 1 seconde
let multiplierMouse = 1;
let multiplierMouseCost = 100;
let autoClickerCost = 10;
let OmaCost = 125;
let speedCost = 0;

// Cookie button
btn.addEventListener('click', function() {
    count += multiplierMouse;
    updateCount();
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});

// Shop button -> koop AutoClicker (meerdere keren mogelijk)
Clicker.addEventListener('click', function() {
    if (count >= autoClickerCost) {
        count -= autoClickerCost;
        updateCount();

        startAutoClicker();

        // Prijs verdubbelt
        autoClickerCost *= 2;
        Clicker.textContent = `🛒 Koop Clicker (${autoClickerCost})`;

        alert("Nieuwe Clicker gekocht!");
    } else {
        alert("Je hebt minimaal " + autoClickerCost + " cookies nodig!");
    }
});

// Oma -> 5 cookies per seconde
Oma.addEventListener('click', function() {
    if (count >= OmaCost) {
        count -= OmaCost;
        updateCount();

        setInterval(() => {
            count += 5;
            updateCount();
        }, OmaRate);

        // Prijs stijgt flink
        OmaCost *= 2;
        Oma.textContent = `👵🏻 Oma (${OmaCost})`;

        alert("Oma aangenomen :D");
    } else {
        alert("Je hebt minimaal " + OmaCost + " cookies nodig!");
    }
});

// Multiplier button -> verdubbelt multiplier (VOOR DE PLAYER Klik ALLEEN)
multiplierMouseBtn.addEventListener('click', function() {
    if (count >= multiplierMouseCost) {
        count -= multiplierMouseCost;
        multiplierMouse *= 2;
        multiplierMouseCost *= 5;
        updateCount();

        multiplierMouseBtn.textContent = `✨ Koop Multiplier (${multiplierMouseCost})`;
        alert("Multiplier gekocht! Je cookies tellen nu x" + multiplierMouse);
    } else {
        alert("Je hebt minimaal " + multiplierMouseCost + " cookies nodig!");
    }
});

// Speed upgrade -> kan maar 2 keer
SpeedBtn.addEventListener('click', function() {
    if (count >= 50 && speedCost < 2) {
        count -= 50;
        updateCount();

        speedCost++;

        if (speedCost === 1) {
            AutoRate = 5000; // 5 seconden
            alert("Speedy Auto gekocht! Je autoclickers zijn nu sneller (5s).");
            SpeedBtn.textContent = `⚡ Koop Speedy Auto (50) [Nog 1 keer]`;
        } else if (speedCost === 2) {
            AutoRate = 2000; // 2 seconden
            alert("Speedy Auto gekocht! Je autoclickers zijn nu super snel (2s).");
            SpeedBtn.remove(); // knop verdwijnt
        }

        restartAutoClickers();
    }
});

// Handige functie
function updateCount() {
    countDiv.textContent = count;
}

// Start een nieuwe autoclicker
function startAutoClicker() {
    let interval = setInterval(() => {
        count += 1;
        updateCount();
    }, AutoRate);
    autoClickers.push(interval);
}

// Stop alle autoclickers en start ze opnieuw met de nieuwe snelheid
function restartAutoClickers() {
    // stop alle oude intervals
    autoClickers.forEach(clearInterval);
    autoClickers = [];

    // start opnieuw voor elke gekochte autoclicker
    let amount = Math.log2(autoClickerCost / 10); // bereken aantal gekochte autoclickers
    for (let i = 0; i < amount; i++) {
        startAutoClicker();
    }
}

