import { homeTranslations } from '../data/translations.js';
import { renderMenu, initMenu } from './components/menu.js';
import { renderFooter } from './components/footer.js';
import { applyTranslations, initLanguageSwitcher } from './components/language.js';
import { initAboutSlider } from './components/about-slider.js';

const menuWrapper = document.getElementById('nav-wrapper');
const menuButton = document.getElementById('menu-btn');
const footer = document.getElementById('site-footer');
const menu = initMenu({ wrapper: menuWrapper, button: menuButton });

renderMenu(menuWrapper, [
    { href: '#about', key: 'nav_about' },
    { href: '/project', key: 'nav_projects' },
    { href: '#contact', key: 'nav_contact' }
]);
renderFooter(footer);

let currentLanguage = 'en';
const slider = initAboutSlider({
    translations: homeTranslations[currentLanguage],
    textElement: document.getElementById('about-text'),
    dots: document.querySelectorAll('.about__dot')
});

function applyLanguage(language) {
    currentLanguage = language;
    applyTranslations(homeTranslations, language);
    slider.setLanguage(homeTranslations[language]);
}

initLanguageSwitcher({
    onChange: applyLanguage
});
applyLanguage(currentLanguage);

function smoothScrollTo(targetY, duration = 1200) {
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        window.scrollTo(0, startY + difference * ease);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

document.querySelectorAll('.header__nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));

        if (!target) {
            return;
        }

        menu.close();
        setTimeout(() => {
            smoothScrollTo(target.getBoundingClientRect().top + window.scrollY);
        }, 300);
    });
});
