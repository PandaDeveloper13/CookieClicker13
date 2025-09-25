let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const shopBtn = document.getElementById('shopBtn');
const multiplierBtn = document.getElementById('multiplierBtn');
const autoClickerBtn = document.getElementById('autoClickerBtn');
const cpsDiv = document.getElementById('cps');
const AutoRate = 1000;  
let multiplier = 1;
let multiplierCost = 50;
let shopCost = 250;
let autoClickerCost = 1000;
let autoClickerCount = 0;

// Stats tracking variables
let totalClicks = 0;
let cookiesSpent = 0;
let allTimeCookies = 0;

// Get stats display elements
const totalCookiesDisplay = document.getElementById('totalCookies');
const currentCPSDisplay = document.getElementById('currentCPS');
const totalClicksDisplay = document.getElementById('totalClicks');
const grandmaCountDisplay = document.getElementById('grandmaCount');
const cookiesSpentDisplay = document.getElementById('cookiesSpent');
const allTimeCookiesDisplay = document.getElementById('allTimeCookies');

// Cookie button
btn.addEventListener('click', function() {
    count += multiplier;
    totalClicks++;
    allTimeCookies += multiplier;
    updateCount();
    updateStats();
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});

// Multiplier button -> doubles multiplier
multiplierBtn.addEventListener('click', function() {
    if (count >= multiplierCost) {
        count -= multiplierCost;
        cookiesSpent += multiplierCost;
        multiplier *= 1.5;
        multiplierCost = Math.ceil(multiplierCost * 2.9);
        updateCount();
        updateStats();
        multiplierBtn.innerHTML = `CPS Multiplier<br><small>Increases your clicking power<br>Cost: ${multiplierCost} cookies</small>`;
        alert("Multiplier bought! Your clicks now produces more cookies!");
        updateCPS();
    } else {
        alert("You need minimum " + multiplierCost + " cookies!");
    }
});

// Shop button -> buy AutoClicker (multiple purchases possible)
shopBtn.addEventListener('click', function() {
    if (count >= shopCost) {
        count -= shopCost;
        cookiesSpent += shopCost;
        updateCount();

        autoClickerCount += 0.5; // Increase autoclicker count by 0.5
        updateCPS();
        updateStats();

        // Start a new interval for this autoclicker
        setInterval(() => {
            count += 1 * multiplier;
            allTimeCookies += 1 * multiplier;
            updateCount();
            updateStats();
        }, AutoRate);

        shopCost = Math.ceil(shopCost * 2.9);
        shopBtn.innerHTML = `Grandma<br><small>Produces cookies automatically<br>Cost: ${shopCost} cookies</small>`;
        alert("Grandma bought! Your multiplier is now x" + multiplier);
    } else {
        alert("You need minimum " + shopCost + " cookies!");
    }
});

// Auto Clicker button
autoClickerBtn.addEventListener('click', function() {
    if (count >= autoClickerCost) {
        count -= autoClickerCost;
        cookiesSpent += autoClickerCost;
        updateCount();
        updateStats();

        // Start auto-clicking
        setInterval(() => {
            count += multiplier;
            allTimeCookies += multiplier;
            updateCount();
            updateStats();
        }, 1000); // Clicks every second

        autoClickerCost = Math.ceil(autoClickerCost * 2.9);
        autoClickerBtn.innerHTML = `Auto Clicker<br><small>Clicks for you every second<br>Cost: ${autoClickerCost} cookies</small>`;
        alert("Auto Clicker bought! It will now click for you every second!");
    } else {
        alert("You need minimum " + autoClickerCost + " cookies!");
    }
});

// Handige functie
function updateCount() {
    countDiv.textContent = count;
}

// Update CPS display
function updateCPS() {
    cpsDiv.textContent = "per second: " + (autoClickerCount * multiplier).toFixed(1);
}

// Update statistics display
function updateStats() {
    if (totalCookiesDisplay) totalCookiesDisplay.textContent = count;
    if (currentCPSDisplay) currentCPSDisplay.textContent = (autoClickerCount * multiplier).toFixed(1);
    if (totalClicksDisplay) totalClicksDisplay.textContent = totalClicks;
    if (grandmaCountDisplay) grandmaCountDisplay.textContent = (autoClickerCount * 2).toFixed(0);
    if (cookiesSpentDisplay) cookiesSpentDisplay.textContent = cookiesSpent;
    if (allTimeCookiesDisplay) allTimeCookiesDisplay.textContent = allTimeCookies;
}



