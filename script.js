function showHideMenu() {
    const menu = document.getElementById("menu");
    const isOpen = menu.classList.toggle("open");
    const burgerMenu = document.querySelector('.burger-menu')
    burgerMenu.setAttribute('aria-expanded', isOpen.toString());
    burgerMenu.classList.toggle("open"); 
}

function closeMenu() {
    const menu = document.getElementById("menu");
    const burgerMenu = document.querySelector('.burger-menu');
    menu.classList.remove("open");
    burgerMenu.classList.remove("open");
    burgerMenu.setAttribute('aria-expanded', 'false');
}

document.querySelector('.burger-menu').addEventListener('click', showHideMenu);

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.getElementById("year").textContent = new Date().getFullYear().toString()

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = langData[key];
    });
}

function updateBadges(lang) {
    document.getElementById('app-store-badge').src = `badges/apple/${lang}.svg`;
    document.getElementById('google-play-badge').src = `badges/google/${lang}.svg`;
}

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
}

async function fetchLanguageData(lang) {
    const response = await fetch(`languages/${lang}.json`);
    return response.json();
}

async function changeLanguage(lang) {
    setLanguagePreference(lang);
    const langData = await fetchLanguageData(lang);
    updateContent(langData);
    updateBadges(lang);
}

window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryLanguage = urlParams.get('lang') || 'en';
    const userPreferredLanguage = localStorage.getItem('language') || queryLanguage;
    document.getElementById('languages').value = userPreferredLanguage
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    updateBadges(userPreferredLanguage);
});