let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const GrandmaBtn = document.getElementById('GrandmaBtn');
const multiplierBtn = document.getElementById('multiplierBtn');
const supplierBtn = document.getElementById('supplierBtn');
const cpsDiv = document.getElementById('cps');
const AutoRate = 1000;  
let multiplier = 1;
let multiplierCost = 50;
let GrandmaCost = 50;
let supplierCost = 2000;
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
        multiplier *= 2;
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
GrandmaBtn.addEventListener('click', function() {
    if (count >= GrandmaCost) {
        count -= GrandmaCost;
        cookiesSpent += GrandmaCost;
        updateCount();

        autoClickerCount += 2; // Increase autoclicker count by 2
        updateCPS();
        updateStats();

        // Start a new interval for this autoclicker
        setInterval(() => {
            count += multiplier;
            allTimeCookies += multiplier;
            updateCount();
            updateStats();
        }, AutoRate);

        GrandmaCost = Math.ceil(GrandmaCost * 2.9);
        GrandmaBtn.innerHTML = `Grandma<br><small>Produces cookies automatically<br>Cost: ${GrandmaCost} cookies</small>`;
        alert("Grandma bought! and you have " + autoClickerCount + " grandmas!");
    } else {
        alert("You need minimum " + GrandmaCost + " cookies!");
    }
});

// Auto Clicker button
supplierBtn.addEventListener('click', function() {
    if (count >= supplierCost) {
        count -= supplierCost;
        cookiesSpent += supplierCost;
        updateCount();
        updateStats();

        // Start auto-clicking
        setInterval(() => {
            count +=5 * multiplier;
            allTimeCookies += 5 * multiplier;
            updateCount();
            updateStats();
        }, 1000); // Clicks every second

        supplierCost = Math.ceil(supplierCost * 2.9);
        supplierBtn.innerHTML = `Supplier<br><small>Clicks for you every second<br>Cost: ${supplierCost} cookies</small>`;
        alert("Auto Clicker bought! It will now click for you every second!");
    } else {
        alert("You need minimum " + supplierCost + " cookies!");
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



