export function applyTranslations(translations, language) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = translations[language]?.[key];

        if (!value) {
            return;
        }

        if (key === 'title' || key === 'page_title') {
            element.innerHTML = value;
        } else {
            element.textContent = value;
        }
    });

    document.querySelectorAll('.header__lang-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.lang === language);
    });
    document.documentElement.lang = language;
}

export function initLanguageSwitcher({ onChange }) {
    document.querySelectorAll('.header__lang-btn').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            onChange(event.currentTarget.dataset.lang);
        });
    });
}
