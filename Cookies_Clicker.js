// ------------------ Global game state ------------------
let count = 50000;
let totalClicks = 0;
let cookiesSpent = 0;
let allTimeCookies = 0;
let multiplier = 1; // click multiplier
let autoClickerCount = 0; // base auto production
let autoOutputMultiplier = 1; // factor of upgrades
let autoProductionInterval = null;
let baseInterval = 1000;
let currentInterval = baseInterval;

// Boost settings
let chefBoostDuration = 15000; // 15 sec
let chefCooldownTime = 300000; // 5 min
let chefBoostFactor = 0.5;     // halve interval = 2x sneller

// HTML refs
const btn = document.getElementById('cookieBtn');
const countDiv = document.getElementById('count');
const cpsDiv = document.getElementById('cps');

// Stats displays
const totalCookiesDisplay = document.getElementById('totalCookies');
const totalClicksDisplay = document.getElementById('totalClicks');
const cookiesSpentDisplay = document.getElementById('cookiesSpent');
const allTimeCookiesDisplay = document.getElementById('allTimeCookies');
const grandmaCountDisplay = document.getElementById('grandmaCount');
const supplierCountDisplay = document.getElementById('supplierCount');
const chefCountDisplay = document.getElementById('chefCount');
const bankCountDisplay = document.getElementById('bankCount');
const currentCPSDisplay = document.getElementById('currentCPS');

// ------------------ Base Upgrade Class ------------------
class Upgrade {
    constructor(name, baseCost, product, costGrowth, buttonEl, displayEl, mode="multiplier") {
        this.name = name;
        this.cost = baseCost;
        this.effect = product;
        this.costGrowth = costGrowth;
        this.count = 0;
        this.buttonEl = buttonEl;
        this.displayEl = displayEl;
        this.mode = mode;

        if (this.buttonEl) {
            this.updateButton();
            this.buttonEl.addEventListener('click', () => this.buy());
        }
    }

    buy() {
        if (count >= this.cost) {
            count -= this.cost;
            cookiesSpent += this.cost;
            this.count++;
            this.cost = Math.ceil(this.cost * this.costGrowth);

            if (this.mode === "multiplier") {
                autoOutputMultiplier *= this.effect;
            } else if (this.mode === "production") {
                autoClickerCount += this.effect;
            }

            this.updateButton();
            this.updateDisplay();
            updateCount();
            updateCPS();
            updateStats();
            startAutoProduction();
        } else {
            alert(`You need at least ${this.cost} cookies for ${this.name}!`);
        }
    }

    updateButton() {
        if (this.buttonEl) {
            this.buttonEl.innerHTML = `${this.name}<br><small>Cost: ${this.cost} cookies</small>`;
        }
    }

    updateDisplay() {
        if (this.displayEl) {
            this.displayEl.textContent = this.count;
        }
    }
}

// ------------------ Create Upgrades ------------------
const multiplierBtn = document.getElementById('multiplierBtn');
const shopBtn = document.getElementById('shopBtn');
const supplierBtn = document.getElementById('supplierBtn');
const chefBtn = document.getElementById('chefBtn');
const bankBtn = document.getElementById('bankBtn');
const templeBtn = document.getElementById('templeBtn');

const grandma = new Upgrade("Grandma", 250, 2, 3.3, shopBtn, grandmaCountDisplay, "production");
const supplier = new Upgrade("Supplier", 2000, 5, 3.4, supplierBtn, supplierCountDisplay, "multiplier");
const chef = new Upgrade("Pastry Chef", 5000, 5, 3.5, chefBtn, chefCountDisplay, "production"); // autoclicker
const bank = new Upgrade("Bank", 20000, 100, 3.6, bankBtn, bankCountDisplay, "multiplier");
const temple = new Upgrade("Temple", 100000, 500, 4.0, templeBtn, null, "production");

// ------------------ Core Functions ------------------
function updateCount() {
    countDiv.textContent = Math.ceil(count) + " cookies";
}

function updateCPS() {
    const cookiesPerTick = autoClickerCount * multiplier * autoOutputMultiplier;
    const cps = (cookiesPerTick / (currentInterval / 1000));
    cpsDiv.textContent = "per second: " + Math.ceil(cps);
    if (currentCPSDisplay) {
        currentCPSDisplay.textContent = Math.ceil(cps);
    }
}

function updateStats() {
    totalCookiesDisplay.textContent = Math.ceil(count);
    totalClicksDisplay.textContent = totalClicks;
    cookiesSpentDisplay.textContent = Math.ceil(cookiesSpent);
    allTimeCookiesDisplay.textContent = Math.ceil(allTimeCookies);
    grandma.updateDisplay();
    supplier.updateDisplay();
    chef.updateDisplay();
    bank.updateDisplay();
    updateBoostButton();
    updateEnhancements();
}

function startAutoProduction() {
    if (autoProductionInterval) clearInterval(autoProductionInterval);

    if (autoClickerCount > 0) {
        autoProductionInterval = setInterval(() => {
            const cookiesPerTick = autoClickerCount * multiplier * autoOutputMultiplier;
            count += cookiesPerTick;
            allTimeCookies += cookiesPerTick;
            updateCount();
            updateCPS();
            updateStats();
        }, currentInterval);
    }
}

// ------------------ Cookie button ------------------
btn.addEventListener('click', function() {
    count += multiplier;
    totalClicks++;
    allTimeCookies += multiplier;
    updateCount();
    updateStats();
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});

// ------------------ Options & Stats toggle ------------------
const optionsWindow = document.getElementById('optionsWindow');
const optionsToggleBtn = document.getElementById('optionsToggleBtn');
const statsWindow = document.getElementById('statsWindow');
const statsToggleBtn = document.getElementById('statsToggleBtn');

if (optionsToggleBtn && optionsWindow) {
    optionsToggleBtn.addEventListener('click', () => {
        const hidden = optionsWindow.classList.toggle('hidden');
        optionsToggleBtn.setAttribute('aria-expanded', (!hidden).toString());
    });
}

if (statsToggleBtn && statsWindow) {
    statsToggleBtn.addEventListener('click', () => {
        const isHidden = statsWindow.classList.toggle('hidden');
        statsToggleBtn.textContent = isHidden ? 'Show Stats' : 'Hide Stats';
        statsToggleBtn.setAttribute('aria-expanded', (!isHidden).toString());
        if (!isHidden) {
            updateStats();
        }
    });
}

// ------------------ Chef Boost ------------------
const chefBoostBtn = document.getElementById('chefBoostBtn');
const chefBoostStatus = document.getElementById('chefBoostStatus');

let chefBoostActive = false;
let chefBoostCooldown = false;
let chefBoostTimer = null;

// Activate boost
chefBoostBtn.addEventListener('click', () => {
    if (!chefBoostActive && !chefBoostCooldown && chef.count > 0) {
        chefBoostActive = true;
        chefBoostBtn.disabled = true;

        let timeLeft = chefBoostDuration / 1000;
        chefBoostStatus.textContent = `🔥 Boost active: ${timeLeft}s`;

        chefBoostTimer = setInterval(() => {
            timeLeft--;
            chefBoostStatus.textContent = `🔥 Boost active: ${timeLeft}s`;
        }, 1000);

        currentInterval = Math.max(100, currentInterval * chefBoostFactor);
        startAutoProduction();

        setTimeout(() => {
            clearInterval(chefBoostTimer);
            chefBoostActive = false;
            chefBoostCooldown = true;
            currentInterval = baseInterval;
            startAutoProduction();

            let cooldownLeft = chefCooldownTime / 1000;
            chefBoostStatus.textContent = `⏳ Cooldown: ${cooldownLeft}s`;
            chefBoostTimer = setInterval(() => {
                cooldownLeft--;
                chefBoostStatus.textContent = `⏳ Cooldown: ${cooldownLeft}s`;
            }, 1000);

            setTimeout(() => {
                clearInterval(chefBoostTimer);
                chefBoostCooldown = false;
                chefBoostBtn.disabled = false;
                chefBoostStatus.textContent = "Chef boost ready!";
            }, chefCooldownTime);

        }, chefBoostDuration);
    }
});

function updateBoostButton() {
    if (chef.count > 0 && !chefBoostActive && !chefBoostCooldown) {
        chefBoostBtn.disabled = false;
        chefBoostStatus.textContent = "Chef boost ready!";
    }
}

// ------------------ Enhancements Progressive Unlock ------------------
const enhBoostTimeBtn = document.getElementById('enhBoostTime');
const enhCooldownBtn = document.getElementById('enhCooldown');
const enhPowerBtn = document.getElementById('enhPower');

let enhBoostTimeCost = 10000;
let enhCooldownCost = 25000;
let enhPowerCost = 50000;

function updateEnhancements() {
    // Als Chef gekocht is en er nog geen upgrade zichtbaar is → toon V1
    if (chef.count > 0 && enhBoostTimeBtn.classList.contains("hidden") &&
        enhCooldownBtn.classList.contains("hidden") &&
        enhPowerBtn.classList.contains("hidden")) {
        enhBoostTimeBtn.classList.remove("hidden");
    }
}

// V1 → na aankoop V2 tonen
enhBoostTimeBtn.addEventListener('click', () => {
    if (count >= enhBoostTimeCost) {
        count -= enhBoostTimeCost;
        cookiesSpent += enhBoostTimeCost;
        chefBoostDuration += 15000;
        updateCount();
        updateStats();

        enhBoostTimeBtn.classList.add("hidden");
        enhCooldownBtn.classList.remove("hidden");
    } else {
        alert("Not enough cookies!");
    }
});

// V2 → na aankoop V3 tonen
enhCooldownBtn.addEventListener('click', () => {
    if (count >= enhCooldownCost) {
        count -= enhCooldownCost;
        cookiesSpent += enhCooldownCost;
        chefCooldownTime = Math.max(60000, chefCooldownTime - 60000);
        updateCount();
        updateStats();

        enhCooldownBtn.classList.add("hidden");
        enhPowerBtn.classList.remove("hidden");
    } else {
        alert("Not enough cookies!");
    }
});

// V3 → laatste upgrade
enhPowerBtn.addEventListener('click', () => {
    if (count >= enhPowerCost) {
        count -= enhPowerCost;
        cookiesSpent += enhPowerCost;
        chefBoostFactor = 0.3;
        updateCount();
        updateStats();

        enhPowerBtn.classList.add("hidden");
    } else {
        alert("Not enough cookies!");
    }
});

// ------------------ Init ------------------
updateCount();
updateCPS();
updateStats();
