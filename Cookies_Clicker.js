let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const Clicker = document.getElementById('Clicker');
const Oma = document.getElementById('Oma');
const multiplierBtn = document.getElementById('multiplierBtn');
const AutoRate = 10000; // 10 seconden
const OmaRate = 1000; // 1 seconde
let multiplier = 1;
let multiplierCost = 100;
let autoClickerCost = 20;
let OmaCost = 20;

// Cookie button
btn.addEventListener('click', function() {
    count += multiplier;
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
            count += multiplier;
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
            count += 2 * multiplier;

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

// Multiplier button -> verdubbelt multiplier
multiplierBtn.addEventListener('click', function() {
    if (count >= multiplierCost) {
        count -= multiplierCost;
        multiplier *= 2;
        multiplierCost *= 5;
        updateCount();

        multiplierBtn.textContent = `✨ Koop Multiplier (${multiplierCost})`;
        alert("Multiplier gekocht! Je cookies tellen nu x" + multiplier);
    } else {
        alert("Je hebt minimaal " + multiplierCost + " cookies nodig!");
    }
});

// Handige functie
function updateCount() {
    countDiv.textContent = count;
}
