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
let autoProductionInterval = null;
// Extra global multiplier for automatic production from advanced upgrades
let autoOutputMultiplier = 1;

// Costs for new upgrades
let supplierCost = 2000;
let chefCost = 5000;
let bankCost = 20000;
// Individual purchase counters for advanced upgrades
let supplierCount = 0;
let chefCount = 0;
let bankCountVar = 0; // using different name to avoid id clash

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
// New stat display elements
const supplierCountDisplay = document.getElementById('supplierCount');
const chefCountDisplay = document.getElementById('chefCount');
const bankCountDisplay = document.getElementById('bankCount');
// Options elements
const optionsWindow = document.getElementById('optionsWindow');
const optionsToggleBtn = document.getElementById('optionsToggleBtn');
const languageSelect = document.getElementById('languageSelect');
// New upgrade buttons
const supplierBtn = document.getElementById('supplierBtn');
const chefBtn = document.getElementById('chefBtn');
const bankBtn = document.getElementById('bankBtn');


let currentLang = localStorage.getItem('lang') || 'en';
if (languageSelect) languageSelect.value = currentLang;

function applyTranslations() {
    const t = translations[currentLang];
    // Buttons
    if (multiplierBtn) multiplierBtn.innerHTML = t.cpsButton(multiplierCost);
    if (shopBtn) shopBtn.innerHTML = t.grandmaButton(shopCost);
    if (statsToggleBtn) statsToggleBtn.textContent = statsWindow.classList.contains('hidden') ? t.statsShow : t.statsHide;
    if (optionsToggleBtn) optionsToggleBtn.textContent = optionsWindow.classList.contains('hidden') ? t.optionsShow : t.optionsHide;
    // Stats labels
    const labelMap = {
        totalCookies: t.stats.total,
        currentCPS: t.stats.currentCPS,
        totalClicks: t.stats.totalClicks,
        grandmaCount: t.stats.grandma,
        supplierCount: t.stats.supplier,
        chefCount: t.stats.chef,
        bankCount: t.stats.bank,
        cookiesSpent: t.stats.spent,
        allTimeCookies: t.stats.allTime
    };
    Object.entries(labelMap).forEach(([id, text]) => {
        const span = document.querySelector(`#${id}`)?.parentElement?.querySelector('.stat-label');
        if (span) span.textContent = text;
    });
    // Options window labels
    const optionsTitle = optionsWindow?.querySelector('h4');
    if (optionsTitle) optionsTitle.textContent = t.optionsTitle;
    const langLabel = optionsWindow?.querySelector('label[for="languageSelect"]');
    if (langLabel) langLabel.textContent = t.languageLabel;
}

if (languageSelect) {
    languageSelect.addEventListener('change', () => {
        currentLang = languageSelect.value;
        localStorage.setItem('lang', currentLang);
        applyTranslations();
        updateStats();
        updateCPS();
    });
}

// Options toggle logic
if (optionsToggleBtn && optionsWindow) {
    optionsToggleBtn.addEventListener('click', () => {
        const hidden = optionsWindow.classList.toggle('hidden');
        optionsToggleBtn.setAttribute('aria-expanded', (!hidden).toString());
        applyTranslations();
    });
}
// Stats toggle elements
const statsWindow = document.getElementById('statsWindow');
const statsToggleBtn = document.getElementById('statsToggleBtn');

if (statsToggleBtn && statsWindow) {
    statsToggleBtn.addEventListener('click', () => {
        const isHidden = statsWindow.classList.toggle('hidden');
        statsToggleBtn.textContent = isHidden ? 'Show Stats' : 'Hide Stats';
        statsToggleBtn.setAttribute('aria-expanded', (!isHidden).toString());
        // Ensure stats are fresh when opened
        if (!isHidden) {
            updateStats();
        }
    });
}

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
        multiplierCost = Math.ceil(multiplierCost * 3.2);
        // Update button text with new cost
        multiplierBtn.innerHTML = `CPS<br><small>Increases your clicking power<br>Cost: ${multiplierCost} cookies</small>`;
        updateCount();
        updateCPS();
        updateStats();
        startAutoProduction(); // Restart auto production with new multiplier
        alert("CPS multiplier purchased!");
    } else {
        alert(`You need minimum ${multiplierCost} cookies!`);
    }
});

// Shop button -> buy AutoClicker (multiple purchases possible)
shopBtn.addEventListener('click', function() {
    if (count >= shopCost) {
        count -= shopCost;
        cookiesSpent += shopCost;
        updateCount();

        autoClickerCount += 1.5; // Increase autoclicker count by 1.5 (your design choice)
        updateCPS();
        updateStats();
        startAutoProduction();

        shopCost = Math.ceil(shopCost * 3.3);
        // Update button text with new cost
        shopBtn.innerHTML = `Grandma<br><small>Produces cookies automatically<br>Cost: ${shopCost} cookies</small>`;
        alert("Grandma purchased!");
    } else {
        alert(`You need minimum ${shopCost} cookies!`);
    }
});

// Supplier upgrade -> multiplies automatic production by 1.5x
if (supplierBtn) {
    supplierBtn.addEventListener('click', function() {
        if (count >= supplierCost) {
            count -= supplierCost;
            cookiesSpent += supplierCost;
            autoOutputMultiplier *= 1.5;
            supplierCount++;
            supplierCost = Math.ceil(supplierCost * 3.4); // cost scaling
            supplierBtn.innerHTML = `Supplier<br><small>Increases cookie production<br>Cost: ${supplierCost} cookies</small>`;
            updateCount();
            updateCPS();
            updateStats();
            startAutoProduction();
        } else {
            alert(`You need minimum ${supplierCost} cookies!`);
        }
    });
}

// Pastry Chef upgrade -> multiplies automatic production by 30x
if (chefBtn) {
    chefBtn.addEventListener('click', function() {
        if (count >= chefCost) {
            count -= chefCost;
            cookiesSpent += chefCost;
            autoOutputMultiplier *= 30;
            chefCount++;
            chefCost = Math.ceil(chefCost * 3.5);
            chefBtn.innerHTML = `Pastry Chef<br><small>Professionally baked cookies<br>Cost: ${chefCost} cookies</small>`;
            updateCount();
            updateCPS();
            updateStats();
            startAutoProduction();
        } else {
            alert(`You need minimum ${chefCost} cookies!`);
        }
    });
}

// Bank upgrade -> multiplies automatic production by 100x
if (bankBtn) {
    bankBtn.addEventListener('click', function() {
        if (count >= bankCost) {
            count -= bankCost;
            cookiesSpent += bankCost;
            autoOutputMultiplier *= 100;
            bankCountVar++;
            bankCost = Math.ceil(bankCost * 3.6);
            bankBtn.innerHTML = `Bank<br><small>Produces cookies over time<br>Cost: ${bankCost} cookies</small>`;
            updateCount();
            updateCPS();
            updateStats();
            startAutoProduction();
        } else {
            alert(`You need minimum ${bankCost} cookies!`);
        }
    });
}

// Handige functie
function updateCount() {
    countDiv.textContent = Math.ceil(count) + " cookies";
}

// Update CPS display
function updateCPS() {
    cpsDiv.textContent = "per second: " + Math.ceil(autoClickerCount * multiplier * autoOutputMultiplier);
}

// Update statistics display
function updateStats() {
    if (totalCookiesDisplay) totalCookiesDisplay.textContent = Math.ceil(count);
    if (currentCPSDisplay) currentCPSDisplay.textContent = Math.ceil(multiplier);
    if (totalClicksDisplay) totalClicksDisplay.textContent = totalClicks;
    if (grandmaCountDisplay) grandmaCountDisplay.textContent = Math.ceil(autoClickerCount * multiplier * autoOutputMultiplier);
    if (supplierCountDisplay) supplierCountDisplay.textContent = supplierCount;
    if (chefCountDisplay) chefCountDisplay.textContent = chefCount;
    if (bankCountDisplay) bankCountDisplay.textContent = bankCountVar;
    if (cookiesSpentDisplay) cookiesSpentDisplay.textContent = Math.ceil(cookiesSpent);
    if (allTimeCookiesDisplay) allTimeCookiesDisplay.textContent = Math.ceil(allTimeCookies);
}

// Start or restart auto production with current multiplier
function startAutoProduction() {
    // Clear existing interval if it exists
    if (autoProductionInterval) {
        clearInterval(autoProductionInterval);
    }
    
    // Only start if we have grandmas
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

// Initialize displays when page loads
updateCPS();
updateStats();


