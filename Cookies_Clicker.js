let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const shopBtn = document.getElementById('shopBtn');
const multiplierBtn = document.getElementById('multiplierBtn');
const AutoRate = 1000; // elke seconde
let multiplier = 1;
let multiplierCost = 10;
let autoClickerCost = 5;

// Cookie button
btn.addEventListener('click', function() {
    count += multiplier;
    updateCount();
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});

// Shop button -> koop AutoClicker (meerdere keren mogelijk)
shopBtn.addEventListener('click', function() {
    if (count >= autoClickerCost) {
        count -= autoClickerCost;
        updateCount();

        // Start een nieuwe interval voor deze autoclicker
        setInterval(() => {
            count += multiplier;
            updateCount();
        }, AutoRate);

        // Prijs verdubbelt
        autoClickerCost *= 2;
        shopBtn.textContent = `🛒 Koop AutoClicker (${autoClickerCost})`;

        alert("Nieuwe AutoClicker gekocht!");
    } else {
        alert("Je hebt minimaal " + autoClickerCost + " cookies nodig!");
    }
});

// Multiplier button -> verdubbelt multiplier
multiplierBtn.addEventListener('click', function() {
    if (count >= multiplierCost) {
        count -= multiplierCost;
        multiplier *= 2;
        multiplierCost *= 2;
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
