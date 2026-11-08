export function renderMenu(container, links) {
    container.innerHTML = `
        <div class="header__nav-inner">
            <nav class="header__nav">
                ${links.map(({ href, key, active = false }) => `
                    <a href="${href}"${active ? ' class="active"' : ''} data-i18n="${key}"></a>
                `).join('')}
                <div class="header__lang-switch">
                    <button class="header__lang-btn active" data-lang="en">EN</button>
                    <span>|</span>
                    <button class="header__lang-btn" data-lang="fr">FR</button>
                </div>
            </nav>
        </div>
    `;
}

export function initMenu({ wrapper, button }) {
    const spans = button.querySelectorAll('span');

    const close = () => {
        wrapper.classList.remove('is-active');
        button.classList.remove('is-active');
        spans.forEach(span => {
            span.style.transform = 'none';
        });
    };

    button.addEventListener('click', () => {
        const isActive = wrapper.classList.toggle('is-active');
        button.classList.toggle('is-active', isActive);
        spans[0].style.transform = isActive
            ? 'rotate(45deg) translate(2px, 2px)'
            : 'none';
        spans[1].style.transform = isActive
            ? 'rotate(-45deg) translate(2px, -2px)'
            : 'none';
    });

    return { close };
}
