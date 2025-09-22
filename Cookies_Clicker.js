let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const Clicker = document.getElementById('Clicker');
const Oma = document.getElementById('Oma');
const multiplierMouseBtn = document.getElementById('multiplierMouseBtn');
const AutoRate = 10000; // 10 seconde
const OmaRate = 5000; // 5 seconde
let multiplierMouse = 1;
let multiplierMouseCost = 100;
let autoClickerCost = 20;
let OmaCost = 125;

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

        // Start een nieuwe interval voor deze autoclicker
        setInterval(() => {
            count += 3;
            updateCount();
        }, AutoRate);

        // Prijs verdubbelt
        autoClickerCost *= 5;
        Clicker.textContent = `🛒 Koop Clicker (${autoClickerCost})`;

        alert("Nieuwe Clicker gekocht!");
    } else {
        alert("Je hebt minimaal " + autoClickerCost + " cookies nodig!");
    }
});
Oma.addEventListener('click', function() {
    if (count >= OmaCost) {
        count -= OmaCost;
        updateCount();

        // Start een nieuwe interval voor deze Oma
        setInterval(() => {
            count += 5;

            updateCount();
        }, OmaRate);

        // Prijs stijging
        OmaCost *= 5;
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

// Handige functie
function updateCount() {
    countDiv.textContent = count;
}
