import { errorTranslations } from '../data/translations.js';
import { applyTranslations, initLanguageSwitcher } from './components/language.js';
import { renderFooter } from './components/footer.js';

const footer = document.getElementById('site-footer');
let currentLanguage = 'en';

function applyLanguage(language) {
    currentLanguage = language;
    applyTranslations(errorTranslations, currentLanguage);
}

renderFooter(footer);
initLanguageSwitcher({ onChange: applyLanguage });
applyLanguage(currentLanguage);
