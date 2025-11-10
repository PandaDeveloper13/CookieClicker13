// ------------------ Global game state ------------------
let count = 10000;
let totalClicks = 0;
let cookiesSpent = 0;
let allTimeCookies = 0;
let multiplier = 1;
let autoClickerCount = 0;
let autoOutputMultiplier = 1;
let autoProductionInterval = null;
let baseInterval = 1000;
let currentInterval = baseInterval;

// Boost settings
let chefBoostDuration = 15000;
let chefCooldownTime = 300000;
let chefBoostFactor = 0.5;


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
const bakkerijCountDisplay = document.getElementById('bakkerijCount');
const bankCountDisplay = document.getElementById('bankCount');
const FabriekCountDisplay = document.getElementById('FabriekCount');
const templeCountDisplay = document.getElementById('templeCount');
const corporateCountDisplay = document.getElementById('corporateCount');
const currentCPSDisplay = document.getElementById('currentCPS');

// ------------------ Base AutoClicker (Parent) ------------------
class AutoClicker {
    constructor(name, baseCost, product, costGrowth, buttonEl, displayEl) {
        this.name = name;
        this.cost = baseCost;
        this.effect = product;
        this.costGrowth = costGrowth;
        this.count = 0;
        this.buttonEl = buttonEl;
        this.displayEl = displayEl;

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
            autoClickerCount += this.effect;

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
// ------------------ Create Clickers ------------------
const multiplierBtn = document.getElementById('multiplierBtn');
const shopBtn = document.getElementById('shopBtn');
const supplierBtn = document.getElementById('supplierBtn');
const chefBtn = document.getElementById('chefBtn');
const bakkerijBtn = document.getElementById('bakkerijbtn');
const bankBtn = document.getElementById('bankBtn');
const templeBtn = document.getElementById('templeBtn');
const corporateBtn = document.getElementById('corporateBtn');
const FabriekBtn = document.getElementById('FabriekBtn');

const grandma = new AutoClicker("Grandma", 100, 2, 1.1, shopBtn, grandmaCountDisplay);
const supplier = new AutoClicker("Supplier", 500, 100, 1.1, supplierBtn, supplierCountDisplay);
const chef = new AutoClicker("Pastry Chef", 1500, 250, 1.2, chefBtn, chefCountDisplay);
const bakkerij = new AutoClicker("Bakkerij", 10000, 2000, 1.3, bakkerijBtn, bakkerijCountDisplay);
const bank = new AutoClicker("Bank", 25000, 5000, 1.3, bankBtn, bankCountDisplay);
const Fabriek = new AutoClicker("Fabriek", 75000, 8000, 1.2, FabriekBtn , FabriekCountDisplay);
const temple = new AutoClicker("Temple", 100000, 10000, 1.2, templeBtn, templeCountDisplay);
const corporation = new AutoClicker("Corporation", 500000, 50000, 1.2, corporateBtn, corporateCountDisplay);




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
    bakkerij.updateDisplay();
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
    startGrandmaBonusTimer();
}


// cookie button
btn.addEventListener('click', function() {
    count += multiplier;
    totalClicks++;
    allTimeCookies += multiplier;
    updateCount();
    updateStats();
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});
// grandma bonus
let grandmaBonusTimer = null;

// Tweak these to balance
const GRANDMA_BONUS_INTERVAL_MS = 1000; // check every second
const GRANDMA_BONUS_CHANCE      = 0.02; // 20% chance per tick
const GRANDMA_BONUS_AMOUNT      = 25;   // per grandma when it hits

function startGrandmaBonusTimer() {
    // Only start once, and only if player owns at least 1 grandma
    if (grandmaBonusTimer || grandma.count <= 0) return;

    grandmaBonusTimer = setInterval(() => {
        if (grandma.count <= 0) return; // safety if ever reduced
        if (Math.random() < GRANDMA_BONUS_CHANCE) {
            const bonus = GRANDMA_BONUS_AMOUNT * grandma.count;
            count += bonus;
            allTimeCookies += bonus;
            // (Optional) tiny feedback:
            // console.log(`🧓 Grandma bonus +${bonus}`);
            updateCount();
            updateCPS();
            updateStats();
        }
    }, GRANDMA_BONUS_INTERVAL_MS);
}

// chef boost
const chefBoostBtn = document.getElementById('chefBoostBtn');
const chefBoostStatus = document.getElementById('chefBoostStatus');
let chefBoostActive = false;
let chefBoostCooldown = false;
let chefBoostTimer = null;

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
let enhPowerCost   = 50000;

// ------- Helpers: mark done + (optional) persistence -------
function markDone(btn, key) {
    if (!btn) return;
    btn.dataset.done = "1";
    btn.classList.add("hidden");
    try { localStorage.setItem(key, "1"); } catch {}
}

function restoreDone(btn, key) {
    try {
        if (localStorage.getItem(key) === "1") {
            btn?.classList.add("hidden");
            if (btn) btn.dataset.done = "1";
        }
    } catch {}
}

// Restore completion state on load
restoreDone(enhBoostTimeBtn,  "enhBoostTimeDone");
restoreDone(enhCooldownBtn,   "enhCooldownDone");
restoreDone(enhPowerBtn,      "enhPowerDone");

// ------- Only show the first step when appropriate, never after all done -------
function updateEnhancements() {
    const done1 = enhBoostTimeBtn?.dataset.done === "1";
    const done2 = enhCooldownBtn?.dataset.done === "1";
    const done3 = enhPowerBtn?.dataset.done === "1";

    // If everything is completed, never show anything again.
    if (done1 && done2 && done3) return;

    // Show the first button only when all are hidden, user has a chef,
    // and the first one hasn't been completed yet.
    if (
        chef.count > 0 &&
        enhBoostTimeBtn &&
        enhBoostTimeBtn.classList.contains("hidden") &&
        !done1 &&
        (enhCooldownBtn?.classList.contains("hidden") ?? true) &&
        (enhPowerBtn?.classList.contains("hidden") ?? true)
    ) {
        enhBoostTimeBtn.classList.remove("hidden");
    }
}

enhBoostTimeBtn?.addEventListener('click', () => {
    if (count >= enhBoostTimeCost) {
        count -= enhBoostTimeCost;
        cookiesSpent += enhBoostTimeCost;
        chefBoostDuration += 15000;
        updateCount();
        updateStats();

        // permanently hide BoostTime, reveal Cooldown
        markDone(enhBoostTimeBtn, "enhBoostTimeDone");
        enhCooldownBtn?.classList.remove("hidden");
    } else if (enhBoostTimeBtn) {
        // optional: UI feedback for insufficient cookies
    } else {
        alert("Not enough cookies!");
    }
});

enhCooldownBtn?.addEventListener('click', () => {
    if (count >= enhCooldownCost) {
        count -= enhCooldownCost;
        cookiesSpent += enhCooldownCost;
        chefCooldownTime = Math.max(60000, chefCooldownTime - 60000);
        updateCount();
        updateStats();

        // permanently hide Cooldown, reveal Power
        markDone(enhCooldownBtn, "enhCooldownDone");
        enhPowerBtn?.classList.remove("hidden");
    } else {
        alert("Not enough cookies!");
    }
});

enhPowerBtn?.addEventListener('click', () => {
    if (count >= enhPowerCost) {
        count -= enhPowerCost;
        cookiesSpent += enhPowerCost;
        chefBoostFactor = 0.2;
        updateCount();
        updateStats();

        // permanently hide Power; nothing else shows after this
        markDone(enhPowerBtn, "enhPowerDone");
    } else {
        alert("Not enough cookies!");
    }
});

// ------------------ SAVE / LOAD SYSTEM ------------------

// Welke data we willen bewaren
function getSaveData() {
    return {
        count,
        totalClicks,
        cookiesSpent,
        allTimeCookies,
        multiplier,
        autoClickerCount,
        autoOutputMultiplier,
        baseInterval,
        currentInterval,
        chefBoostDuration,
        chefCooldownTime,
        chefBoostFactor,
        autoClickers: {
            grandma: { count: grandma.count, cost: grandma.cost },
            supplier: { count: supplier.count, cost: supplier.cost },
            chef: { count: chef.count, cost: chef.cost },
            bakkerij: { count: bakkerij.count, cost: bakkerij.cost },
            bank: { count: bank.count, cost: bank.cost },
            temple: { count: temple.count, cost: temple.cost }
        }
    };
}

// Herstellen van opgeslagen data
function loadSaveData(save) {
    if (!save) return;

    // Basiswaarden herstellen
    count = save.count || 0;
    totalClicks = save.totalClicks || 0;
    cookiesSpent = save.cookiesSpent || 0;
    allTimeCookies = save.allTimeCookies || 0;
    multiplier = save.multiplier || 1;
    autoClickerCount = save.autoClickerCount || 0;
    autoOutputMultiplier = save.autoOutputMultiplier || 1;
    baseInterval = save.baseInterval || 1000;
    currentInterval = save.currentInterval || baseInterval;

    chefBoostDuration = save.chefBoostDuration || 15000;
    chefCooldownTime = save.chefCooldownTime || 300000;
    chefBoostFactor = save.chefBoostFactor || 0.5;

    // AutoClickers herstellen
    if (save.autoClickers) {
        for (let key in save.autoClickers) {
            const data = save.autoClickers[key];
            if (window[key]) {
                window[key].count = data.count || 0;
                window[key].cost = data.cost || window[key].cost;
                window[key].updateButton();
                window[key].updateDisplay();
            }
        }
    }

    updateCount();
    updateCPS();
    updateStats();
    startAutoProduction();
}
// ===============================
// TOGGLE: OPTIONS & STATS
// ===============================
const optionsToggleBtn = document.getElementById("optionsToggleBtn");
const optionsWindow = document.getElementById("optionsWindow");

const statsToggleBtn = document.getElementById("statsToggleBtn");
const statsWindow = document.getElementById("statsWindow");

// ---- OPTIONS ----
if (optionsToggleBtn && optionsWindow) {
    optionsToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willShow = optionsWindow.classList.contains("hidden");
        optionsWindow.classList.toggle("hidden");
        optionsToggleBtn.setAttribute("aria-expanded", willShow ? "true" : "false");
    });
}

// ---- STATS ----
if (statsToggleBtn && statsWindow) {
    statsToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willShow = statsWindow.classList.contains("hidden");
        statsWindow.classList.toggle("hidden");
        statsToggleBtn.textContent = willShow ? "Hide Stats" : "Show Stats";
        statsToggleBtn.setAttribute("aria-expanded", willShow ? "true" : "false");
    });
}

// ---- Klik buiten om te sluiten ----
document.addEventListener("click", (e) => {
    // OPTIONS sluiten
    if (
        optionsWindow &&
        !optionsWindow.classList.contains("hidden") &&
        !optionsWindow.contains(e.target) &&
        e.target !== optionsToggleBtn
    ) {
        optionsWindow.classList.add("hidden");
        optionsToggleBtn.setAttribute("aria-expanded", "false");
    }

    // STATS sluiten
    if (
        statsWindow &&
        !statsWindow.classList.contains("hidden") &&
        !statsWindow.contains(e.target) &&
        e.target !== statsToggleBtn
    ) {
        statsWindow.classList.add("hidden");
        statsToggleBtn.textContent = "Show Stats";
        statsToggleBtn.setAttribute("aria-expanded", "false");
    }
});


// Opslaan in localStorage
function saveGame() {
    const data = getSaveData();
    localStorage.setItem("cookieGameSave", JSON.stringify(data));
    console.log("✅ Game saved!");
}

// Laden uit localStorage
function loadGame() {
    const data = JSON.parse(localStorage.getItem("cookieGameSave"));
    if (data) {
        loadSaveData(data);
        console.log("🎮 Game loaded!");
    } else {
        console.log("No save found.");
    }
}

// Automatisch opslaan elke 30 seconden
setInterval(saveGame, 30000);

// Game automatisch laden bij het opstarten
window.addEventListener('load', () => {
    loadGame();
});

// Optioneel: handmatige save/load knoppen (voeg toe in je HTML)
const manualSaveBtn = document.getElementById('saveGameBtn');
const manualLoadBtn = document.getElementById('loadGameBtn');
if (manualSaveBtn) manualSaveBtn.addEventListener('click', saveGame);
if (manualLoadBtn) manualLoadBtn.addEventListener('click', loadGame);
// ------------------ RESET GAME ------------------
function resetGame() {
    if (confirm("Weet je zeker dat je al je voortgang wilt wissen?")) {
        localStorage.removeItem("cookieGameSave"); // verwijdert opgeslagen data

        // Alles terugzetten naar beginwaarden
        count = 0;
        totalClicks = 0;
        cookiesSpent = 0;
        allTimeCookies = 0;
        multiplier = 1;
        autoClickerCount = 0;
        autoOutputMultiplier = 1;
        currentInterval = baseInterval;

        // Reset boosts en upgrades
        chefBoostDuration = 15000;
        chefCooldownTime = 300000;
        chefBoostFactor = 0.5;

        // Reset alle autoclickers
        [grandma, supplier, chef, bakkerij, bank, temple].forEach(ac => {
            ac.count = 0;
            ac.cost = Math.ceil(ac.cost / Math.pow(ac.costGrowth, ac.count)); // terug naar originele cost
            ac.updateButton();
            ac.updateDisplay();
        });

        // UI bijwerken
        updateCount();
        updateCPS();
        updateStats();

        // Auto-production stoppen
        if (autoProductionInterval) clearInterval(autoProductionInterval);

        alert("Alle voortgang is gewist. Het spel is opnieuw gestart!");
    }
}

// Koppel knop
const resetGameBtn = document.getElementById('resetGameBtn');
if (resetGameBtn) resetGameBtn.addEventListener('click', resetGame);


updateCount();
updateCPS();
updateStats();
startAutoProduction();
