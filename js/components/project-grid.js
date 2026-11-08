export function renderProjectGrid({ container, projects, language, onSelect }) {
    container.innerHTML = projects.map((project, index) => `
        <article class="project-card" data-index="${index}">
            <div class="project-card__image-wrapper">
                <img src="${project.images[0]}" alt="${project.title[language]}" class="project-card__image">
                <div class="project-card__overlay">
                    <div class="project-card__overlay-icon">
                        <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </div>
                </div>
            </div>
            <div class="project-card__content">
                <h2 class="project-card__title">${project.title[language]}</h2>
                <p class="project-card__desc">${project.desc[language]}</p>
            </div>
        </article>
    `).join('');

    container.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            onSelect(Number(card.dataset.index));
        });
    });
}
