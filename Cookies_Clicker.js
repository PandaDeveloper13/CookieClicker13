let count = 0;
const countDiv = document.getElementById('count');
const btn = document.getElementById('cookieBtn');

btn.addEventListener('click', function() {
    count++;
    countDiv.textContent = count;
    btn.classList.add('clicked');
    setTimeout(() => btn.classList.remove('clicked'), 200);
});
