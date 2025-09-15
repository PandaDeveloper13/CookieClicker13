let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');
const shopBtn = document.getElementById('shopBtn');
const AutoRate = 1000; // elke seconde
let autoClickerActive = false; // zodat hij maar 1 keer start

// Cookie button
btn.addEventListener('click', function() {
    count++;
    countDiv.textContent = count;
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});

// Shop button
shopBtn.addEventListener('click', function() {
    if (count >= 20 && !autoClickerActive) {
    count -= 20; // kosten voor autoclicker
    countDiv.textContent = count;
    autoClickerActive = true;

    setInterval(() => {
    count++;
    countDiv.textContent = count;
}, AutoRate);
} else if (count < 20) {
    alert("Je hebt minimaal 20 cookies nodig!");
}
});


