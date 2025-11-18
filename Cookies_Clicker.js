let count = 1000000;
let totalClicks = 0;
let cookiesSpent = 0;
let allTimeCookies = 0;
let multiplier = 1;
let multiplierCost = 50;
let multiplierLevel = 0;
const multiplierGrowth = 3.25;

let autoClickerCount = 0;
let autoOutputMultiplier = 1;
let autoProductionInterval = null;
let baseInterval = 1000;
let currentInterval = baseInterval;

let chefBoostDuration = 15000;
let chefCooldownTime  = 300000;
let chefBoostFactor   = 0.5;

let grandmaBonusChance = 0.1;
let grandmaBonusAmount = 10;

let supplierDropTimer = null;
let supplierDropIntervalMs = 30000;
let supplierDropAmountBase = 5000;

let bakeryChefBonusPerChef = 2000;

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
const bakkerijBtn = document.getElementById('bakkerijbtn');
const bankBtn = document.getElementById('bankBtn');
const templeBtn = document.getElementById('templeBtn');
const corporateBtn = document.getElementById('corporateBtn');
const FabriekBtn = document.getElementById('FabriekBtn');

class AutoClicker {
    constructor(name, baseCost, product, costGrowth, buttonEl, displayEl) {
        this.name = name;
        this.baseCost = baseCost;
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
            this.cost = Math.ceil(this.baseCost * Math.pow(this.costGrowth, this.count));
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
const grandma = new AutoClicker("Grandma", 100, 2, 1.1, shopBtn, grandmaCountDisplay);
const supplier = new AutoClicker("Supplier", 2000, 100, 1.2, supplierBtn, supplierCountDisplay);
const chef = new AutoClicker("Pastry Chef", 20000, 350, 1.2, chefBtn, chefCountDisplay);
const bakkerij = new AutoClicker("Bakkerij", 100000, 3500, 1.3, bakkerijBtn, bakkerijCountDisplay);
const bank = new AutoClicker("Bank", 350000, 5000, 1.3, bankBtn, bankCountDisplay);
const Fabriek = new AutoClicker("Fabriek", 850000, 8000, 1.2, FabriekBtn, FabriekCountDisplay);
const temple = new AutoClicker("Temple", 1200000, 10000, 1.2, templeBtn, templeCountDisplay);
const corporation = new AutoClicker("Corporation", 5000000, 50000, 1.2, corporateBtn, corporateCountDisplay);
function updateCount() {
    if (countDiv) countDiv.textContent = Math.ceil(count) + " cookies";
}
function updateCPS() {
    const cookiesPerTickBase = autoClickerCount * multiplier * autoOutputMultiplier;
    let bakerySynergy = 0;
    if (bakkerij.count > 0 && chef.count > 0) {
        bakerySynergy = bakkerij.count * chef.count * bakeryChefBonusPerChef;
    }
    const cookiesPerTick = cookiesPerTickBase + bakerySynergy;
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
function updateMultiplierButton() {
    if (multiplierBtn) {
        multiplierBtn.innerHTML = `CPS<br><small>Increases your clicking power<br>Cost: ${multiplierCost} cookies</small>`;
    }
}
function buyMultiplier() {
    if (count >= multiplierCost) {
        count -= multiplierCost;
        cookiesSpent += multiplierCost;
        multiplierLevel++;
        multiplier++;
        multiplierCost = Math.ceil(50 * Math.pow(multiplierGrowth, multiplierLevel));
        updateMultiplierButton();
        updateCount();
        updateStats();
    } else {
        alert(`You need at least ${multiplierCost} cookies for CPS upgrade!`);
    }
}
if (multiplierBtn) {
    updateMultiplierButton();
    multiplierBtn.addEventListener('click', buyMultiplier);
}
function startAutoProduction() {
    if (autoProductionInterval) clearInterval(autoProductionInterval);
    if (autoClickerCount > 0 || (bakkerij.count > 0 && chef.count > 0)) {
        autoProductionInterval = setInterval(() => {
            let cookiesPerTick = autoClickerCount * multiplier * autoOutputMultiplier;
            if (bakkerij.count > 0 && chef.count > 0) {
                const bakeryBonus = bakkerij.count * chef.count * bakeryChefBonusPerChef;
                cookiesPerTick += bakeryBonus;
            }
            count += cookiesPerTick;
            allTimeCookies += cookiesPerTick;
            updateCount();
            updateCPS();
            updateStats();
        }, currentInterval);
    }
    startGrandmaBonusTimer();
    startSupplierDropTimer();
}
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
            updateCount();
            updateCPS();
            updateStats();
        }
    }, GRANDMA_BONUS_INTERVAL_MS);
}
function startSupplierDropTimer() {
    if (supplierDropTimer || supplier.count <= 0) return;
    supplierDropTimer = setInterval(() => {
        if (supplier.count <= 0) return;

        const drop = supplierDropAmountBase * supplier.count;
        count += drop;
        allTimeCookies += drop;

        updateCount();
        updateCPS();
        updateStats();
    }, supplierDropIntervalMs);
}
const chefBoostBtn = document.getElementById('chefBoostBtn');
const chefBoostStatus = document.getElementById('chefBoostStatus');
let chefBoostActive = false;
let chefBoostCooldown = false;
let chefBoostTimer = null;

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
            currentInterval = Math.max(100, Math.floor(currentInterval * chefBoostFactor));
            startAutoProduction();
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

const enhBoostTimeBtn       = document.getElementById('enhBoostTime');
const enhCooldownBtn        = document.getElementById('enhCooldown');
const enhPowerBtn           = document.getElementById('enhPower');
const enhUltraCooldownBtn   = document.getElementById('enhUltraCooldown');
const enhUltraTimeBtn       = document.getElementById('enhUltraTime');

const grannyMoreCookiesBtn  = document.getElementById('grannyMoreCookies');
const grannyMoreChanceBtn   = document.getElementById('grannyMoreChance');

const supplierDropBoostBtn  = document.getElementById('supplierDropBoost');
const supplierDropFasterBtn = document.getElementById('supplierDropFaster');

const bakeryChefBoostBtn    = document.getElementById('bakeryChefBoost');

let enhBoostTimeCost      = 10000;
let enhCooldownCost       = 25000;
let enhPowerCost          = 50000;
let enhUltraCooldownCost  = 75000;
let enhUltraTimeCost      = 100000;

let grannyMoreCookiesCost = 500;
let grannyMoreChanceCost  = 1000;

let supplierDropBoostCost  = 20000;
let supplierDropFasterCost = 30000;

let bakeryChefBoostCost    = 150000;

function getEnhState() {
    let s = {
        chefTime: false,
        chefCooldown: false,
        chefPower: false,
        chefUltraCooldown: false,
        chefUltraTime: false,
        grannyAmount: false,
        grannyChance: false,
        supplierBoost: false,
        supplierFaster: false,
        bakeryChefBoost: false
    };
    try {
        s.chefTime          = localStorage.getItem("enh_chefTime")          === "1";
        s.chefCooldown      = localStorage.getItem("enh_chefCooldown")      === "1";
        s.chefPower         = localStorage.getItem("enh_chefPower")         === "1";
        s.chefUltraCooldown = localStorage.getItem("enh_chefUltraCooldown") === "1";
        s.chefUltraTime     = localStorage.getItem("enh_chefUltraTime")     === "1";

        s.grannyAmount      = localStorage.getItem("enh_grannyAmount")      === "1";
        s.grannyChance      = localStorage.getItem("enh_grannyChance")      === "1";

        s.supplierBoost     = localStorage.getItem("enh_supplierBoost")     === "1";
        s.supplierFaster    = localStorage.getItem("enh_supplierFaster")    === "1";

        s.bakeryChefBoost   = localStorage.getItem("enh_bakeryChefBoost")   === "1";
    } catch {}
    return s;
}
function setEnhDone(key) {
    try { localStorage.setItem(key, "1"); } catch {}
}
function hide(el){ el && el.classList.add("hidden"); }
function show(el){ el && el.classList.remove("hidden"); }
function renderEnhancements() {
    const state = getEnhState();
    hide(enhBoostTimeBtn);
    hide(enhCooldownBtn);
    hide(enhPowerBtn);
    hide(enhUltraCooldownBtn);
    hide(enhUltraTimeBtn);

    hide(grannyMoreCookiesBtn);
    hide(grannyMoreChanceBtn);

    hide(supplierDropBoostBtn);
    hide(supplierDropFasterBtn);

    hide(bakeryChefBoostBtn);

    renderChefEnhancements(state);
    renderGrandmaEnhancements(state);
    renderSupplierEnhancements(state);
    renderBakeryEnhancements(state);
}
function renderChefEnhancements(state) {
    if (chef.count <= 0) return;
    if (!state.chefTime) {
        show(enhBoostTimeBtn);
    } else if (!state.chefCooldown) {
        show(enhCooldownBtn);
    } else if (!state.chefPower) {
        show(enhPowerBtn);
    } else if (!state.chefUltraCooldown) {
        show(enhUltraCooldownBtn);
    } else if (!state.chefUltraTime) {
        show(enhUltraTimeBtn);
    }
}
function renderGrandmaEnhancements(state) {
    if (grandma.count <= 0) return;

    if (!state.grannyAmount) {
        show(grannyMoreCookiesBtn);
    } else if (!state.grannyChance) {
        show(grannyMoreChanceBtn);
    }
}
function renderSupplierEnhancements(state) {
    if (supplier.count <= 0) return;

    if (!state.supplierBoost) {
        show(supplierDropBoostBtn);
    } else if (!state.supplierFaster) {
        show(supplierDropFasterBtn);
    }
}
function renderBakeryEnhancements(state) {
    if (bakkerij.count <= 0) return;
    if (!state.bakeryChefBoost) {
        show(bakeryChefBoostBtn);
    }
}
enhBoostTimeBtn?.addEventListener('click', () => {
    if (count >= enhBoostTimeCost) {
        count -= enhBoostTimeCost;
        cookiesSpent += enhBoostTimeCost;
        chefBoostDuration += 15000;
        setEnhDone("enh_chefTime");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
enhCooldownBtn?.addEventListener('click', () => {
    if (count >= enhCooldownCost) {
        count -= enhCooldownCost;
        cookiesSpent += enhCooldownCost;
        chefCooldownTime -= 60000;
        setEnhDone("enh_chefCooldown");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
enhPowerBtn?.addEventListener('click', () => {
    if (count >= enhPowerCost) {
        count -= enhPowerCost;
        cookiesSpent += enhPowerCost;
        chefBoostFactor = 0.3;
        setEnhDone("enh_chefPower");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
enhUltraCooldownBtn?.addEventListener('click', () => {
    if (count >= enhUltraCooldownCost) {
        count -= enhUltraCooldownCost;
        cookiesSpent += enhUltraCooldownCost;
        chefCooldownTime -= 120000;
        setEnhDone("enh_chefUltraCooldown");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
enhUltraTimeBtn?.addEventListener('click', () => {
    if (count >= enhUltraTimeCost) {
        count -= enhUltraTimeCost;
        cookiesSpent += enhUltraTimeCost;
        chefBoostDuration += 30000;
        setEnhDone("enh_chefUltraTime");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
grannyMoreCookiesBtn?.addEventListener('click', () => {
    if (count >= grannyMoreCookiesCost) {
        count -= grannyMoreCookiesCost;
        cookiesSpent += grannyMoreCookiesCost;
        grandmaBonusAmount += 10;
        setEnhDone("enh_grannyAmount");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
grannyMoreChanceBtn?.addEventListener('click', () => {
    if (count >= grannyMoreChanceCost) {
        count -= grannyMoreChanceCost;
        cookiesSpent += grannyMoreChanceCost;
        grandmaBonusChance += 0.2;
        setEnhDone("enh_grannyChance");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
supplierDropBoostBtn?.addEventListener('click', () => {
    if (count >= supplierDropBoostCost) {
        count -= supplierDropBoostCost;
        cookiesSpent += supplierDropBoostCost;
        supplierDropAmountBase *= 3;
        setEnhDone("enh_supplierBoost");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
supplierDropFasterBtn?.addEventListener('click', () => {
    if (count >= supplierDropFasterCost) {
        count -= supplierDropFasterCost;
        cookiesSpent += supplierDropFasterCost;
        supplierDropIntervalMs = 15000;
        if (supplierDropTimer) {
            clearInterval(supplierDropTimer);
            supplierDropTimer = null;
        }
        startSupplierDropTimer();
        setEnhDone("enh_supplierFaster");
        updateCount(); updateStats(); renderEnhancements();
    } else { alert("Not enough cookies!"); }
});
bakeryChefBoostBtn?.addEventListener('click', () => {
    if (count >= bakeryChefBoostCost) {
        count -= bakeryChefBoostCost;
        cookiesSpent += bakeryChefBoostCost;
        bakeryChefBonusPerChef *= 2;
        setEnhDone("enh_bakeryChefBoost");
        updateCount(); updateStats(); renderEnhancements();
    } else {
        alert("Not enough cookies!");
    }
});
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
        supplierDrops: {
            intervalMs: supplierDropIntervalMs,
            amountBase: supplierDropAmountBase
        },
        bakerySynergy: {
            bonusPerChef: bakeryChefBonusPerChef
        },
        autoClickers: {
            grandma:     { count: grandma.count,     cost: grandma.cost },
            supplier:    { count: supplier.count,    cost: supplier.cost },
            chef:        { count: chef.count,        cost: chef.cost },
            bakkerij:    { count: bakkerij.count,    cost: bakkerij.cost },
            bank:        { count: bank.count,        cost: bank.cost },
            Fabriek:     { count: Fabriek.count,     cost: Fabriek.cost },
            temple:      { count: temple.count,      cost: temple.count },
            corporation: { count: corporation.count, cost: corporation.count }
        }
    };
}
function loadSaveData(save) {
    if (!save) return;
    count = save.count ?? 0;
    totalClicks = save.totalClicks ?? 0;
    cookiesSpent = save.cookiesSpent ?? 0;
    allTimeCookies = save.allTimeCookies ?? 0;
    multiplier = save.multiplier ?? 1;
    autoOutputMultiplier = save.autoOutputMultiplier ?? 1;
    baseInterval = save.baseInterval ?? 1000;
    currentInterval = save.currentInterval ?? baseInterval;
    if (save.chefBoost) {
        chefBoostDuration = save.chefBoost.duration ?? 15000;
        chefCooldownTime  = save.chefBoost.cooldown ?? 300000;
        chefBoostFactor   = save.chefBoost.factor ?? 0.5;
    }
    if (save.grandmaBonus) {
        grandmaBonusChance = save.grandmaBonus.chance ?? 0.1;
        grandmaBonusAmount = save.grandmaBonus.amount ?? 10;
    }
    if (save.supplierDrops) {
        supplierDropIntervalMs = save.supplierDrops.intervalMs ?? 15000;
        supplierDropAmountBase = save.supplierDrops.amountBase ?? 5000;
    }
    if (save.bakerySynergy) {
        bakeryChefBonusPerChef = save.bakerySynergy.bonusPerChef ?? 2000;
    }
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
    updateCount();
    updateCPS();
    updateStats();
    startAutoProduction();
    renderEnhancements();
}
function saveGame() {
    const data = getSaveData();
    localStorage.setItem("cookieGameSave", JSON.stringify(data));
}
function loadGame() {
    const raw = localStorage.getItem("cookieGameSave");
    if (!raw) {
        updateCount(); updateCPS(); updateStats(); startAutoProduction(); renderEnhancements();
        return;
    }
    const data = JSON.parse(raw);
    loadSaveData(data);
}
setInterval(saveGame, 15000);
window.addEventListener('load', () => {
    loadGame();
    renderEnhancements();
});
const optionsToggleBtn = document.getElementById("optionsToggleBtn");
const optionsWindow = document.getElementById("optionsWindow");
const statsToggleBtn = document.getElementById("statsToggleBtn");
const statsWindow = document.getElementById("statsWindow");
if (optionsToggleBtn && optionsWindow) {
    optionsToggleBtn.addEventListener("click", () => {
        const willShow = optionsWindow.classList.contains("hidden");
        optionsWindow.classList.toggle("hidden");
        optionsToggleBtn.setAttribute("aria-expanded", willShow ? "true" : "false");
    });
}
if (statsToggleBtn && statsWindow) {
    statsToggleBtn.addEventListener("click", () => {
        const willShow = statsWindow.classList.contains("hidden");
        statsWindow.classList.toggle("hidden");
        statsToggleBtn.textContent = willShow ? "Hide Stats" : "Show Stats";
        statsToggleBtn.setAttribute("aria-expanded", willShow ? "true" : "false");
    });
}
const manualSaveBtn = document.getElementById('saveGameBtn');
const manualLoadBtn = document.getElementById('loadGameBtn');
if (manualSaveBtn) manualSaveBtn.addEventListener('click', saveGame);
if (manualLoadBtn) manualLoadBtn.addEventListener('click', loadGame);
function resetGame() {
    if (!confirm("Weet je zeker dat je al je voortgang wilt wissen?")) return;
    localStorage.removeItem("cookieGameSave");
    try {
        localStorage.removeItem("enh_chefTime");
        localStorage.removeItem("enh_chefCooldown");
        localStorage.removeItem("enh_chefPower");
        localStorage.removeItem("enh_chefUltraCooldown");
        localStorage.removeItem("enh_chefUltraTime");
        localStorage.removeItem("enh_grannyAmount");
        localStorage.removeItem("enh_grannyChance");
        localStorage.removeItem("enh_supplierBoost");
        localStorage.removeItem("enh_supplierFaster");
        localStorage.removeItem("enh_bakeryChefBoost");
    } catch {}
    if (autoProductionInterval) clearInterval(autoProductionInterval);
    if (grandmaBonusTimer) { clearInterval(grandmaBonusTimer); grandmaBonusTimer = null; }
    if (chefBoostTimer) clearInterval(chefBoostTimer);
    if (supplierDropTimer) { clearInterval(supplierDropTimer); supplierDropTimer = null; }

    count = 0; totalClicks = 0; cookiesSpent = 0; allTimeCookies = 0;
    multiplier = 1; autoClickerCount = 0; autoOutputMultiplier = 1;
    currentInterval = baseInterval;

    chefBoostDuration = 15000;
    chefCooldownTime = 300000;
    chefBoostFactor = 0.5;
    grandmaBonusChance = 0.1;
    grandmaBonusAmount = 10;
    supplierDropIntervalMs = 30000;
    supplierDropAmountBase = 5000;
    bakeryChefBonusPerChef = 2000;

    chefBoostActive = false;
    chefBoostCooldown = false;
    if (chefBoostBtn) chefBoostBtn.disabled = true;
    if (chefBoostStatus) chefBoostStatus.textContent = "Chef boost ready!";

    [grandma, supplier, chef, bakkerij, bank, Fabriek, temple, corporation].forEach(ac => ac.reset());

    updateCount();
    updateCPS();
    updateStats();
    renderEnhancements();

    alert("Alle voortgang is gewist. Het spel is opnieuw gestart!");
}
const resetGameBtn = document.getElementById('resetGameBtn');
if (resetGameBtn) resetGameBtn.addEventListener('click', resetGame);
updateCount();
updateCPS();
updateStats();
startAutoProduction();
renderEnhancements();
