let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const shopBtn = document.getElementById('shopBtn');
const multiplierBtn = document.getElementById('multiplierBtn'); // nieuwe knop
const AutoRate = 1000; // elke seconde
let autoClickerActive = false;
let multiplier = 1; // standaard 1
let multiplierCost = 100; // eerste prijs voor multiplier

// Cookie button
btn.addEventListener('click', function() {
    count += multiplier; // multiplier telt ook mee
    countDiv.textContent = count;
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});

// Shop button -> AutoClicker
shopBtn.addEventListener('click', function() {
    if (count >= 25 && !autoClickerActive) {
        count -= 25;
        countDiv.textContent = count;
        autoClickerActive = true;

        setInterval(() => {
            count += multiplier; // autoclicker telt ook met multiplier
            countDiv.textContent = count;
        }, AutoRate);
    } else if (count < 25) {
        alert("Je hebt minimaal 50 cookies nodig!");
    }
});

// Multiplier button -> verdubbelt multiplier
multiplierBtn.addEventListener('click', function() {
    if (count >= multiplierCost) {
        count -= multiplierCost;
        multiplier *= 2; // verdubbelt multiplier
        multiplierCost *= 3; // prijs verdubbelt telkens
        countDiv.textContent = count;
        alert("Multiplier gekocht! Je cookies tellen nu x" + multiplier);
    } else {
        alert("Je hebt minimaal " + multiplierCost + " cookies nodig!");
    }
});



