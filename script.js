function showHideMenu() {
    const menu = document.getElementById("menu");
    const isOpen = menu.classList.toggle("open");
    const burgerMenu = document.querySelector('.burger-menu')
    burgerMenu.setAttribute('aria-expanded', isOpen.toString());
    burgerMenu.classList.toggle("open"); 
}

document.querySelector('.burger-menu').addEventListener('click', showHideMenu);
document.getElementById("year").textContent = new Date().getFullYear().toString()

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = langData[key];
    });
}

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

async function fetchLanguageData(lang) {
    const response = await fetch(`languages/${lang}.json`);
    return response.json();
}

async function changeLanguage(lang) {
    await setLanguagePreference(lang);

    const langData = await fetchLanguageData(lang);
    updateContent(langData);
}

window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage = localStorage.getItem('language') || 'en';
    document.getElementById('languages').value = userPreferredLanguage
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
});