const SCRIPT_BASE_URL = new URL('.', document.currentScript.src);
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
}

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = langData[key];
    });
}

function updateBadges(lang) {
    const appStoreBadge = document.getElementById('app-store-badge');
    const googlePlayBadge = document.getElementById('google-play-badge');

    if (appStoreBadge) {
        appStoreBadge.src = new URL(`badges/apple/${lang}.svg`, SCRIPT_BASE_URL).href;
    }

    if (googlePlayBadge) {
        googlePlayBadge.src = new URL(`badges/google/${lang}.svg`, SCRIPT_BASE_URL).href;
    }
}

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
}

async function fetchLanguageData(lang) {
    const response = await fetch(new URL(`languages/${lang}.json`, SCRIPT_BASE_URL));
    return response.json();
}

async function fetchDisclamerEn(lang) {
    const container = document.getElementById('iqos-disclaimer-en-container');
    const disclaimer = document.getElementById('iqos-disclaimer-en');

    if (!container || !disclaimer) {
        return;
    }

    if (lang !== 'en') {
        const response = await fetch(new URL(`languages/en.json`, SCRIPT_BASE_URL));
        const langData = await response.json();
        disclaimer.innerHTML = langData['iqos-disclaimer'];
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
    let queryLanguage = urlParams.get('lang') || 'en';
    
    if (!isLanguageSupported(queryLanguage)) {
        queryLanguage = 'en';
    }
    let userPreferredLanguage = localStorage.getItem('language') || queryLanguage;

    if (!isLanguageSupported(userPreferredLanguage)) {
        localStorage.removeItem('language');
        userPreferredLanguage = 'en';
    }

    const languageSelect = document.getElementById('languages');

    if (languageSelect) {
        languageSelect.value = userPreferredLanguage;
    }

    const langData = await fetchLanguageData(userPreferredLanguage);
    updateContent(langData);
    updateBadges(userPreferredLanguage);
    fetchDisclamerEn(userPreferredLanguage);
});