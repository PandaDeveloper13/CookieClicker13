// ------------------ Global game state ------------------
let count = 1500000;
let totalClicks = 0;
let cookiesSpent = 0;
let allTimeCookies = 0;
let multiplier = 1;

let autoClickerCount = 0;            // som van alle effecten * counts
let autoOutputMultiplier = 1;
let autoProductionInterval = null;

let baseInterval = 1000;             // ms tussen ticks
let currentInterval = baseInterval;

// ------------------ Chef Boost settings ------------------
let chefBoostDuration = 15000;       // ms
let chefCooldownTime  = 300000;      // ms
let chefBoostFactor   = 0.5;         // interval multiplier tijdens boost (lager = sneller)

// ------------------ Grandma bonus settings ------------------
let grandmaBonusChance = 0.2;        // kans per tick (voorheen const)
let grandmaBonusAmount = 10;         // bonus per grandma

// ------------------ DOM refs ------------------
const btn = document.getElementById('cookieBtn');
const countDiv = document.getElementById('count');
const cpsDiv = document.getElementById('cps');

let totalCookiesDisplay = document.getElementById('totalCookies');
let totalClicksDisplay = document.getElementById('totalClicks');
let cookiesSpentDisplay = document.getElementById('cookiesSpent');
let allTimeCookiesDisplay = document.getElementById('allTimeCookies');

let grandmaCountDisplay = document.getElementById('grandmaCount');
let supplierCountDisplay = document.getElementById('supplierCount');
let chefCountDisplay = document.getElementById('chefCount');
let bakkerijCountDisplay = document.getElementById('bakkerijCount');
let bankCountDisplay = document.getElementById('bankCount');
let FabriekCountDisplay = document.getElementById('FabriekCount');
let templeCountDisplay = document.getElementById('templeCount');
let corporateCountDisplay = document.getElementById('corporateCount');

let currentCPSDisplay = document.getElementById('currentCPS');

const multiplierBtn = document.getElementById('multiplierBtn');
const shopBtn = document.getElementById('shopBtn');
const supplierBtn = document.getElementById('supplierBtn');
const chefBtn = document.getElementById('chefBtn');
const bakkerijBtn = document.getElementById('bakkerijbtn'); // kleine 'b' zoals jouw HTML
const bankBtn = document.getElementById('bankBtn');
const templeBtn = document.getElementById('templeBtn');
const corporateBtn = document.getElementById('corporateBtn');
const FabriekBtn = document.getElementById('FabriekBtn');

// ------------------ Base AutoClicker (Parent) ------------------
class AutoClicker {
    constructor(name, baseCost, product, costGrowth, buttonEl, displayEl) {
        this.name = name;
        this.baseCost = baseCost; // voor reset & correcte kostenberekening
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
            // cost = baseCost * growth^count (consistent en exact)
            this.cost = Math.ceil(this.baseCost * Math.pow(this.costGrowth, this.count));
            autoClickerCount += this.effect;

            this.updateButton();
            this.updateDisplay();
            updateCount(); updateCPS(); updateStats(); startAutoProduction();
        } else {
            alert(`You need at least ${this.cost} cookies for ${this.name}!`);
        }
    }

    reset() {
        autoClickerCount -= this.effect * this.count;
        if (autoClickerCount < 0) autoClickerCount = 0;
        this.count = 0;
        this.cost = this.baseCost;
        this.updateButton();
        this.updateDisplay();
    }

    updateButton() {
        if (this.buttonEl) {
            this.buttonEl.innerHTML = `${this.name}<br><small>Cost: ${this.cost} cookies</small>`;
        }
    }

    updateDisplay() {
        if (this.displayEl) this.displayEl.textContent = this.count;
    }
}

// ------------------ Instances ------------------
const grandma = new AutoClicker("Grandma", 100, 2, 1.1, shopBtn, grandmaCountDisplay);
const supplier = new AutoClicker("Supplier", 500, 15, 1.1, supplierBtn, supplierCountDisplay);
const chef = new AutoClicker("Pastry Chef", 1500, 250, 1.2, chefBtn, chefCountDisplay);
const bakkerij = new AutoClicker("Bakkerij", 10000, 2000, 1.3, bakkerijBtn, bakkerijCountDisplay);
const bank = new AutoClicker("Bank", 25000, 5000, 1.3, bankBtn, bankCountDisplay);
const Fabriek = new AutoClicker("Fabriek", 75000, 8000, 1.2, FabriekBtn, FabriekCountDisplay);
const temple = new AutoClicker("Temple", 100000, 10000, 1.2, templeBtn, templeCountDisplay);
const corporation = new AutoClicker("Corporation", 500000, 50000, 1.2, corporateBtn, corporateCountDisplay);

// ------------------ Core Functions ------------------
function updateCount() {
    if (countDiv) countDiv.textContent = Math.ceil(count) + " cookies";
}

function updateCPS() {
    const cookiesPerTick = autoClickerCount * multiplier * autoOutputMultiplier;
    const cps = currentInterval ? (cookiesPerTick / (currentInterval / 1000)) : 0;
    if (cpsDiv) cpsDiv.textContent = "per second: " + Math.max(0, Math.round(cps));
    if (currentCPSDisplay) currentCPSDisplay.textContent = Math.max(0, Math.round(cps));
}

function updateStats() {
    if (totalCookiesDisplay) totalCookiesDisplay.textContent = Math.ceil(count);
    if (totalClicksDisplay) totalClicksDisplay.textContent = totalClicks;
    if (cookiesSpentDisplay) cookiesSpentDisplay.textContent = Math.ceil(cookiesSpent);
    if (allTimeCookiesDisplay) allTimeCookiesDisplay.textContent = Math.ceil(allTimeCookies);

    grandma.updateDisplay();
    supplier.updateDisplay();
    chef.updateDisplay();
    bakkerij.updateDisplay();
    bank.updateDisplay();
    Fabriek.updateDisplay();
    temple.updateDisplay();
    corporation.updateDisplay();

    updateBoostButton();
    renderEnhancements();
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

// ------------------ Cookie button ------------------
if (btn) {
    btn.addEventListener('click', function () {
        count += multiplier;
        totalClicks++;
        allTimeCookies += multiplier;
        updateCount();
        updateStats();
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 200);
    });
}

// ------------------ Grandma random bonus ------------------
let grandmaBonusTimer = null;
const GRANDMA_BONUS_INTERVAL_MS = 1000;

function startGrandmaBonusTimer() {
    if (grandmaBonusTimer || grandma.count <= 0) return;
    grandmaBonusTimer = setInterval(() => {
        if (grandma.count <= 0) return;
        if (Math.random() < grandmaBonusChance) {
            const bonus = grandmaBonusAmount * grandma.count;
            count += bonus;
            allTimeCookies += bonus;
            updateCount(); updateCPS(); updateStats();
        }
    }, GRANDMA_BONUS_INTERVAL_MS);
}

// ------------------ Chef boost ------------------
const chefBoostBtn = document.getElementById('chefBoostBtn');
const chefBoostStatus = document.getElementById('chefBoostStatus');
let chefBoostActive = false;
let chefBoostCooldown = false;
let chefBoostTimer = null;

// standaard uit tot er een chef is
if (chefBoostBtn) chefBoostBtn.disabled = true;

if (chefBoostBtn) {
    chefBoostBtn.addEventListener('click', () => {
        if (!chefBoostActive && !chefBoostCooldown && chef.count > 0) {
            chefBoostActive = true;
            chefBoostBtn.disabled = true;

            let timeLeft = Math.ceil(chefBoostDuration / 1000);
            if (chefBoostStatus) chefBoostStatus.textContent = `🔥 Boost active: ${timeLeft}s`;

            if (chefBoostTimer) clearInterval(chefBoostTimer);
            chefBoostTimer = setInterval(() => {
                timeLeft--;
                if (chefBoostStatus) chefBoostStatus.textContent = `🔥 Boost active: ${timeLeft}s`;
            }, 1000);

            // versnellen: verlaag interval maar nooit onder 100ms
            currentInterval = Math.max(100, Math.floor(currentInterval * chefBoostFactor));
            startAutoProduction();

            // einde boost -> cooldown
            setTimeout(() => {
                if (chefBoostTimer) clearInterval(chefBoostTimer);
                chefBoostActive = false;
                chefBoostCooldown = true;

                currentInterval = baseInterval;
                startAutoProduction();

                let cooldownLeft = Math.ceil(chefCooldownTime / 1000);
                if (chefBoostStatus) chefBoostStatus.textContent = `⏳ Cooldown: ${cooldownLeft}s`;
                chefBoostTimer = setInterval(() => {
                    cooldownLeft--;
                    if (chefBoostStatus) chefBoostStatus.textContent = `⏳ Cooldown: ${cooldownLeft}s`;
                }, 1000);

                setTimeout(() => {
                    if (chefBoostTimer) clearInterval(chefBoostTimer);
                    chefBoostCooldown = false;
                    if (chefBoostBtn) chefBoostBtn.disabled = false;
                    if (chefBoostStatus) chefBoostStatus.textContent = "Chef boost ready!";
                }, chefCooldownTime);

            }, chefBoostDuration);
        }
    });
}

function updateBoostButton() {
    if (!chefBoostBtn || !chefBoostStatus) return;
    if (chef.count > 0 && !chefBoostActive && !chefBoostCooldown) {
        chefBoostBtn.disabled = false;
        chefBoostStatus.textContent = "Chef boost ready!";
    } else if (chef.count === 0) {
        chefBoostBtn.disabled = true;
        chefBoostStatus.textContent = "Buy a Pastry Chef to unlock boost.";
    }
}

// ------------------ Enhancements (ROBUUSTE RENDER) ------------------
const enhBoostTimeBtn   = document.getElementById('enhBoostTime');   // Chef: verlengt boost
const enhCooldownBtn    = document.getElementById('enhCooldown');    // Chef: kortere cooldown
const enhPowerBtn       = document.getElementById('enhPower');       // Chef: snellere interval
const UltraCooldownBtn  = document.getElementById('UltraCooldown');  // Chef: nog kortere cooldown
const UltraTimeBtn      = document.getElementById('UltraTime');      // Chef: nog langere boost

// Grandma enhancement buttons
const grannyMoreCookiesBtn = document.getElementById('grannyMoreCookies'); // meer bonus-koekjes
const grannyMoreChanceBtn  = document.getElementById('grannyMoreChance');  // hogere kans

let grannyMoreCookiesCost = 150;
let grannyMoreChanceCost  = 300;
let enhBoostTimeCost      = 10000;
let enhCooldownCost       = 25000;
let enhPowerCost          = 50000;
let UltraCooldownCost     = 100000;
let UltraTimeCost         = 200000;


// ---- State ophalen uit localStorage ----
function getEnhState() {
    let s = {
        boostTimeDone: false,
        cooldownDone: false,
        powerDone: false,
        ultraCooldownDone: false,
        ultraTimeDone: false,
        grannyMoreCookiesDone: false,
        grannyMoreChanceDone: false
    };
    try {
        s.boostTimeDone         = localStorage.getItem("enhBoostTimeDone")      === "1";
        s.cooldownDone          = localStorage.getItem("enhCooldownDone")       === "1";
        s.powerDone             = localStorage.getItem("enhPowerDone")          === "1";
        s.ultraCooldownDone     = localStorage.getItem("UltraCooldownDone")     === "1";
        s.ultraTimeDone         = localStorage.getItem("UltraTimeDone")         === "1";
        s.grannyMoreCookiesDone = localStorage.getItem("grannyMoreCookiesDone") === "1";
        s.grannyMoreChanceDone  = localStorage.getItem("grannyMoreChanceDone")  === "1";
    } catch {}
    return s;
}

function setEnhDone(key) {
    try { localStorage.setItem(key, "1"); } catch {}
}

function hide(el){ el && el.classList.add("hidden"); }
function show(el){ el && el.classList.remove("hidden"); }

// ---- Nieuwe render: Chef & Grandma gescheiden ----
function renderEnhancements() {
    const state = getEnhState();

    // Alles eerst verbergen
    hide(enhBoostTimeBtn);
    hide(enhCooldownBtn);
    hide(enhPowerBtn);
    hide(UltraCooldownBtn);
    hide(UltraTimeBtn);
    hide(grannyMoreCookiesBtn);
    hide(grannyMoreChanceBtn);

    // Daarna per boom renderen, onafhankelijk van elkaar
    renderChefEnhancements(state);
    renderGrandmaEnhancements(state);
}

// Alleen Chef-upgrades
function renderChefEnhancements(state) {
    if (chef.count <= 0) return;

    if (!state.boostTimeDone) {
        show(enhBoostTimeBtn);
    } else if (!state.cooldownDone) {
        show(enhCooldownBtn);
    } else if (!state.powerDone) {
        show(enhPowerBtn);
    } else if (!state.ultraCooldownDone) {
        show(UltraCooldownBtn);
    } else if (!state.ultraTimeDone) {
        show(UltraTimeBtn);
    }
}

// Alleen Grandma-upgrades
function renderGrandmaEnhancements(state) {
    if (grandma.count <= 0) return;

    if (!state.grannyMoreCookiesDone) {
        show(grannyMoreCookiesBtn);
    } else if (!state.grannyMoreChanceDone) {
        show(grannyMoreChanceBtn);
    }
}

// ---- Chef enhancement acties ----
enhBoostTimeBtn?.addEventListener('click', () => {
    if (count >= enhBoostTimeCost) {
        count -= enhBoostTimeCost;
        cookiesSpent += enhBoostTimeCost;
        chefBoostDuration += 15000;
        setEnhDone("enhBoostTimeDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});

enhCooldownBtn?.addEventListener('click', () => {
    if (count >= enhCooldownCost) {
        count -= enhCooldownCost;
        cookiesSpent += enhCooldownCost;
        chefCooldownTime = Math.max(60000, chefCooldownTime - 60000);
        setEnhDone("enhCooldownDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});

enhPowerBtn?.addEventListener('click', () => {
    if (count >= enhPowerCost) {
        count -= enhPowerCost;
        cookiesSpent += enhPowerCost;
        chefBoostFactor = 0.2;
        setEnhDone("enhPowerDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});

UltraCooldownBtn?.addEventListener('click', () => {
    if (count >= UltraCooldownCost) {
        count -= UltraCooldownCost;
        cookiesSpent += UltraCooldownCost;
        chefCooldownTime = Math.max(120000, chefCooldownTime - 120000);
        setEnhDone("UltraCooldownDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});

UltraTimeBtn?.addEventListener('click', () => {
    if (count >= UltraTimeCost) {
        count -= UltraTimeCost;
        cookiesSpent += UltraTimeCost;
        chefBoostDuration += 60000;
        setEnhDone("UltraTimeDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});

// ---- Grandma enhancement acties ----
grannyMoreCookiesBtn?.addEventListener('click', () => {
    if (count >= grannyMoreCookiesCost) {
        count -= grannyMoreCookiesCost;
        cookiesSpent += grannyMoreCookiesCost;
        grandmaBonusAmount += 20; //
        setEnhDone("grannyMoreCookiesDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});

grannyMoreChanceBtn?.addEventListener('click', () => {
    if (count >= grannyMoreChanceCost) {
        count -= grannyMoreChanceCost;
        cookiesSpent += grannyMoreChanceCost;
        // Oma's krijgen hogere kans
        grandmaBonusChance = Math.min(0.8, grandmaBonusChance + 0.2);
        setEnhDone("grannyMoreChanceDone");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});


// ------------------ SAVE / LOAD SYSTEM ------------------
function getSaveData() {
    return {
        count,
        totalClicks,
        cookiesSpent,
        allTimeCookies,
        multiplier,
        autoOutputMultiplier,
        baseInterval,
        currentInterval,

        chefBoost: {
            duration: chefBoostDuration,
            cooldown: chefCooldownTime,
            factor: chefBoostFactor
        },

        grandmaBonus: {
            chance: grandmaBonusChance,
            amount: grandmaBonusAmount
        },

        enhancements: getEnhState(),

        autoClickers: {
            grandma:     { count: grandma.count,     cost: grandma.cost },
            supplier:    { count: supplier.count,    cost: supplier.cost },
            chef:        { count: chef.count,        cost: chef.cost },
            bakkerij:    { count: bakkerij.count,    cost: bakkerij.cost },
            bank:        { count: bank.count,        cost: bank.cost },
            Fabriek:     { count: Fabriek.count,     cost: Fabriek.cost },
            temple:      { count: temple.count,      cost: temple.cost },
            corporation: { count: corporation.count, cost: corporation.cost }
        }
    };
}

function loadSaveData(save) {
    if (!save) return;

    // basis
    count = save.count ?? 0;
    totalClicks = save.totalClicks ?? 0;
    cookiesSpent = save.cookiesSpent ?? 0;
    allTimeCookies = save.allTimeCookies ?? 0;
    multiplier = save.multiplier ?? 1;
    autoOutputMultiplier = save.autoOutputMultiplier ?? 1;
    baseInterval = save.baseInterval ?? 1000;
    currentInterval = save.currentInterval ?? baseInterval;

    // boost settings
    if (save.chefBoost) {
        chefBoostDuration = save.chefBoost.duration ?? 15000;
        chefCooldownTime  = save.chefBoost.cooldown ?? 300000;
        chefBoostFactor   = save.chefBoost.factor ?? 0.5;
    }

    // grandma bonus settings
    if (save.grandmaBonus) {
        grandmaBonusChance = save.grandmaBonus.chance ?? 0.2;
        grandmaBonusAmount = save.grandmaBonus.amount ?? 10;
    }

    // autoclickers + herbereken autoClickerCount
    autoClickerCount = 0;
    const map = { grandma, supplier, chef, bakkerij, bank, Fabriek, temple, corporation };
    if (save.autoClickers) {
        Object.entries(save.autoClickers).forEach(([key, data]) => {
            const ac = map[key];
            if (ac) {
                ac.count = data.count || 0;
                ac.cost  = data.cost  || ac.cost;
                autoClickerCount += ac.effect * ac.count;
                ac.updateButton();
                ac.updateDisplay();
            }
        });
    }

    // enhancements state -> terug in localStorage (voor de renderer)
    if (save.enhancements) {
        const {
            boostTimeDone,
            cooldownDone,
            powerDone,
            ultraCooldownDone,
            ultraTimeDone,
            grannyMoreCookiesDone,
            grannyMoreChanceDone
        } = save.enhancements;
        try {
            localStorage.setItem("enhBoostTimeDone",      boostTimeDone         ? "1" : "0");
            localStorage.setItem("enhCooldownDone",       cooldownDone          ? "1" : "0");
            localStorage.setItem("enhPowerDone",          powerDone             ? "1" : "0");
            localStorage.setItem("UltraCooldownDone",     ultraCooldownDone     ? "1" : "0");
            localStorage.setItem("UltraTimeDone",         ultraTimeDone         ? "1" : "0");
            localStorage.setItem("grannyMoreCookiesDone", grannyMoreCookiesDone ? "1" : "0");
            localStorage.setItem("grannyMoreChanceDone",  grannyMoreChanceDone  ? "1" : "0");
        } catch {}
    }

    updateCount(); updateCPS(); updateStats(); startAutoProduction();
    renderEnhancements();
}

// Opslaan in localStorage
function saveGame() {
    const data = getSaveData();
    localStorage.setItem("cookieGameSave", JSON.stringify(data));
    console.log("✅ Game saved!");
}

// Laden uit localStorage
function loadGame() {
    const raw = localStorage.getItem("cookieGameSave");
    if (!raw) {
        console.log("No save found.");
        updateCount(); updateCPS(); updateStats(); startAutoProduction();
        renderEnhancements();
        return;
    }
    const data = JSON.parse(raw);
    loadSaveData(data);
    console.log("🎮 Game loaded!");
}

// Automatisch opslaan elke 30 seconden
setInterval(saveGame, 30000);

// Game automatisch laden bij het opstarten
window.addEventListener('load', () => {
    loadGame();
    renderEnhancements();
});

// ------------------ OPTIONS & STATS TOGGLES ------------------
const optionsToggleBtn = document.getElementById("optionsToggleBtn");
const optionsWindow = document.getElementById("optionsWindow");
const statsToggleBtn = document.getElementById("statsToggleBtn");
const statsWindow = document.getElementById("statsWindow");

// OPTIONS
if (optionsToggleBtn && optionsWindow) {
    optionsToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willShow = optionsWindow.classList.contains("hidden");
        optionsWindow.classList.toggle("hidden");
        optionsToggleBtn.setAttribute("aria-expanded", willShow ? "true" : "false");
    });
}

// STATS
if (statsToggleBtn && statsWindow) {
    statsToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willShow = statsWindow.classList.contains("hidden");
        statsWindow.classList.toggle("hidden");
        statsToggleBtn.textContent = willShow ? "Hide Stats" : "Show Stats";
        statsToggleBtn.setAttribute("aria-expanded", willShow ? "true" : "false");
    });
}

// Klik buiten om te sluiten
document.addEventListener("click", (e) => {
    if (optionsWindow &&
        !optionsWindow.classList.contains("hidden") &&
        !optionsWindow.contains(e.target) &&
        e.target !== optionsToggleBtn) {
        optionsWindow.classList.add("hidden");
        optionsToggleBtn?.setAttribute("aria-expanded", "false");
    }

    if (statsWindow &&
        !statsWindow.classList.contains("hidden") &&
        !statsWindow.contains(e.target) &&
        e.target !== statsToggleBtn) {
        statsWindow.classList.add("hidden");
        if (statsToggleBtn) {
            statsToggleBtn.textContent = "Show Stats";
            statsToggleBtn.setAttribute("aria-expanded", "false");
        }
    }
});

// ------------------ Manual save/load buttons ------------------
const manualSaveBtn = document.getElementById('saveGameBtn');
const manualLoadBtn = document.getElementById('loadGameBtn');
if (manualSaveBtn) manualSaveBtn.addEventListener('click', saveGame);
if (manualLoadBtn) manualLoadBtn.addEventListener('click', loadGame);

// ------------------ RESET GAME ------------------
function resetGame() {
    if (!confirm("Weet je zeker dat je al je voortgang wilt wissen?")) return;

    localStorage.removeItem("cookieGameSave");
    try {
        localStorage.removeItem("enhBoostTimeDone");
        localStorage.removeItem("enhCooldownDone");
        localStorage.removeItem("enhPowerDone");
        localStorage.removeItem("UltraCooldownDone");
        localStorage.removeItem("UltraTimeDone");
        localStorage.removeItem("grannyMoreCookiesDone");
        localStorage.removeItem("grannyMoreChanceDone");
    } catch {}

    // timers stoppen
    if (autoProductionInterval) clearInterval(autoProductionInterval);
    if (grandmaBonusTimer) { clearInterval(grandmaBonusTimer); grandmaBonusTimer = null; }
    if (chefBoostTimer) clearInterval(chefBoostTimer);

    // baseline
    count = 0; totalClicks = 0; cookiesSpent = 0; allTimeCookies = 0;
    multiplier = 1; autoClickerCount = 0; autoOutputMultiplier = 1;
    currentInterval = baseInterval;

    // boosts terugzetten
    chefBoostDuration = 15000;
    chefCooldownTime = 300000;
    chefBoostFactor = 0.5;
    grandmaBonusChance = 0.2;
    grandmaBonusAmount = 10;

    chefBoostActive = false;
    chefBoostCooldown = false;
    if (chefBoostBtn) chefBoostBtn.disabled = true;
    if (chefBoostStatus) chefBoostStatus.textContent = "Chef boost ready!";

    // alle autoclickers resetten
    [grandma, supplier, chef, bakkerij, bank, Fabriek, temple, corporation].forEach(ac => ac.reset());

    updateCount(); updateCPS(); updateStats();
    renderEnhancements();

    alert("Alle voortgang is gewist. Het spel is opnieuw gestart!");
}

const resetGameBtn = document.getElementById('resetGameBtn');
if (resetGameBtn) resetGameBtn.addEventListener('click', resetGame);

// ------------------ Initial kick ------------------
updateCount();
updateCPS();
updateStats();
startAutoProduction();
renderEnhancements();
