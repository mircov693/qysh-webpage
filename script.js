const SCRIPT_BASE_URL = new URL('.', document.currentScript.src);
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
}

function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');

        if (Object.prototype.hasOwnProperty.call(langData, key)) {
            element.innerHTML = langData[key];
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');

        if (Object.prototype.hasOwnProperty.call(langData, key)) {
            element.alt = langData[key];
        }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');

        if (Object.prototype.hasOwnProperty.call(langData, key)) {
            element.setAttribute('aria-label', langData[key]);
        }
    });

    document.querySelectorAll('title[data-i18n-doc-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-doc-title');

        if (Object.prototype.hasOwnProperty.call(langData, key)) {
            element.textContent = `QYSH – ${langData[key]}`;
        }
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

function getSupportedLanguage(lang) {
    return isLanguageSupported(lang) ? lang : null;
}

function updateDocumentLanguage(lang) {
    document.documentElement.lang = lang;
}

async function fetchLanguageData(lang) {
    const response = await fetch(new URL(`languages/${lang}.json`, SCRIPT_BASE_URL));
    return response.json();
}

async function fetchDisclaimerEn(lang) {
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

async function applyLanguage(lang) {
    setLanguagePreference(lang);
    updateDocumentLanguage(lang);

    const langData = await fetchLanguageData(lang);
    updateContent(langData);
    updateBadges(lang);
    await fetchDisclaimerEn(lang);
}

async function changeLanguage(lang) {
    if (!isLanguageSupported(lang)) {
        return;
    }

    await applyLanguage(lang);
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

const SUPPORTED_LANGUAGES = ['de', 'en', 'ru'];

function isLanguageSupported(lang) {
    return SUPPORTED_LANGUAGES.includes(lang);
}

window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryLanguage = getSupportedLanguage(urlParams.get('lang'));
    const savedLanguage = getSupportedLanguage(localStorage.getItem('language'));
    const userPreferredLanguage = queryLanguage || savedLanguage || 'en';

    if (!savedLanguage) {
        localStorage.removeItem('language');
    }

    const languageSelect = document.getElementById('languages');

    if (languageSelect) {
        languageSelect.value = userPreferredLanguage;
    }

    await applyLanguage(userPreferredLanguage);
});
