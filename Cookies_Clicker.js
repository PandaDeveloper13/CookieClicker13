// ------------------ Globale game state ------------------
let count = 0;
let totalClicks = 0;
let cookiesSpent = 0;
let allTimeCookies = 0;
let multiplier = 1; // klik multiplier
let autoClickerCount = 0; // basis auto productie
let autoOutputMultiplier = 1; // factor van upgrades
let autoProductionInterval = null;

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

// ------------------ Base Upgrade Class ------------------
class Upgrade {
    constructor(name, baseCost, product, costGrowth, buttonEl, displayEl, mode="multiplier") {
        this.name = name;
        this.cost = baseCost;
        this.effect = product;      // multiplier of base production
        this.costGrowth = costGrowth;
        this.count = 0;
        this.buttonEl = buttonEl;
        this.displayEl = displayEl;
        this.mode = mode; // "multiplier" of autoOutputMultiplier OR "production" (adds autoclickers)

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
const templeBtn = document.getElementById('templeBtn'); // extra in jouw HTML

// klik multiplier upgrade
const clickMultiplier = new Upgrade("CPS", 50, 50, 3.2, multiplierBtn, null, "multiplier");

// autoclicker upgrades
const grandma = new Upgrade("Grandma", 250, 1.5, 3.3, shopBtn, grandmaCountDisplay, "production");
const supplier = new Upgrade("Supplier", 2000, 1.5, 3.4, supplierBtn, supplierCountDisplay, "multiplier");
const chef = new Upgrade("Pastry Chef", 5000, 30, 3.5, chefBtn, chefCountDisplay, "multiplier");
const bank = new Upgrade("Bank", 20000, 100, 3.6, bankBtn, bankCountDisplay, "multiplier");
const temple = new Upgrade("Temple", 100000, 500, 4.0, templeBtn, null, "production");

// ------------------ Core Functions ------------------
function updateCount() {
    countDiv.textContent = Math.ceil(count) + " cookies";
}

function updateCPS() {
    const cps = autoClickerCount * multiplier * autoOutputMultiplier;
    cpsDiv.textContent = "per second: " + Math.ceil(cps);
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
    temple.updateDisplay();
}

function startAutoProduction() {
    if (autoProductionInterval) clearInterval(autoProductionInterval);

    if (autoClickerCount > 0) {
        autoProductionInterval = setInterval(() => {
            const cookiesPerSecond = autoClickerCount * multiplier * autoOutputMultiplier;
            count += cookiesPerSecond;
            allTimeCookies += cookiesPerSecond;
            updateCount();
            updateCPS();
            updateStats();
        }, 1000);
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

// ------------------ Init ------------------
updateCount();
updateCPS();
updateStats();
