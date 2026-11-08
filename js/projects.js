import { projectsTranslations } from './data/translations.js';
import { projectsData } from './data/projects.js';
import { renderMenu, initMenu } from './components/menu.js';
import { renderFooter } from './components/footer.js';
import { applyTranslations, initLanguageSwitcher } from './components/language.js';
import { renderProjectGrid } from './components/project-grid.js';
import { createProjectModal } from './components/project-modal.js';

const menuWrapper = document.getElementById('nav-wrapper');
const footer = document.getElementById('site-footer');

renderMenu(menuWrapper, [
    { href: '/', key: 'nav_about' },
    { href: '/project', key: 'nav_projects', active: true },
    { href: '/#contact', key: 'nav_contact' }
]);
renderFooter(footer);

let currentLanguage = 'en';
const modalElements = {
    modal: document.getElementById('project-modal'),
    close: document.getElementById('close-modal'),
    prevProject: document.getElementById('prev-project'),
    nextProject: document.getElementById('next-project'),
    prevImage: document.getElementById('prev-image'),
    nextImage: document.getElementById('next-image'),
    slider: document.getElementById('modal-slider'),
    sliderDots: document.getElementById('modal-slider-dots'),
    title: document.getElementById('modal-title'),
    description: document.getElementById('modal-desc'),
    stack: document.getElementById('modal-stack'),
    github: document.getElementById('modal-github'),
    getLanguage: () => currentLanguage
};

const modal = createProjectModal({
    projects: projectsData,
    elements: modalElements
});

function renderGrid() {
    renderProjectGrid({
        container: document.getElementById('projects-grid'),
        projects: projectsData,
        language: currentLanguage,
        onSelect: index => modal.open(index, currentLanguage)
    });
}

function applyLanguage(language) {
    currentLanguage = language;
    applyTranslations(projectsTranslations, language);
    renderGrid();
    if (modalElements.modal.classList.contains('is-active')) {
        modal.updateContent(currentLanguage);
    }
}

initLanguageSwitcher({
    onChange: applyLanguage
});
applyLanguage(currentLanguage);
