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

async function fetchDisclamerEn(lang) {
    const container = document.getElementById('iqos-disclaimer-en-container');
    if (lang !== 'en') {
        const response = await fetch(`languages/en.json`);
        const langData = await response.json();
        document.getElementById('iqos-disclaimer-en').innerHTML = langData['iqos-disclaimer'];
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

async function changeLanguage(lang) {
    setLanguagePreference(lang);
    const langData = await fetchLanguageData(lang);
    updateContent(langData);
    updateBadges(lang);
    fetchDisclamerEn(lang);
}

function scrollToHashFragment() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const element = document.getElementById(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

window.addEventListener('load', () => {
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
        scrollToHashFragment();
        return;
    }
    
    let loadedCount = 0;
    const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === images.length) {
            setTimeout(scrollToHashFragment, 100);
        }
    };
    
    images.forEach(img => {
        if (img.complete) {
            checkAllLoaded();
        } else {
            img.addEventListener('load', checkAllLoaded);
            img.addEventListener('error', checkAllLoaded);
        }
    });
});

const SUPPORTED_LANGUAGES = ['bg', 'cs', 'da', 'de', 'el', 'es', 'en', 'fr', 'hu', 'id', 'it', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sv', 'tr', 'uk'];

function isLanguageSupported(lang) {
    return SUPPORTED_LANGUAGES.includes(lang);
}

window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryLanguage = urlParams.get('lang') || 'en';
    
    if (!isLanguageSupported(queryLanguage)) {
        queryLanguage = 'en';
    }
    const userPreferredLanguage = localStorage.getItem('language') || queryLanguage;

    if (!isLanguageSupported(userPreferredLanguage)) {
        localStorage.removeItem('language');
        userPreferredLanguage = 'en';
    }

    document.getElementById('languages').value = userPreferredLanguage
    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    updateBadges(userPreferredLanguage);
    fetchDisclamerEn(userPreferredLanguage);
});