import { errorPages } from '../data/translations.js';
import { applyTranslations, initLanguageSwitcher } from './components/language.js';
import { renderFooter } from './components/footer.js';

const footer = document.getElementById('site-footer');
const errorCode = document.body.dataset.errorCode || '404';
const errorTranslations = errorPages[errorCode] || errorPages[404];
let currentLanguage = 'en';

function applyLanguage(language) {
    currentLanguage = language;
    applyTranslations(errorTranslations, currentLanguage);
}

renderFooter(footer);
initLanguageSwitcher({ onChange: applyLanguage });
applyLanguage(currentLanguage);
