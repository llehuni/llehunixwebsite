/* DONNÉES DES PROJETS */
const projectsData = [
    {
        id: 1,
        title: { en: "TaskFlow App", fr: "Application TaskFlow" },
        desc: { 
            en: "A productivity web app designed to help teams manage tasks seamlessly with real-time collaboration.", 
            fr: "Une application web de productivité conçue pour aider les équipes à gérer leurs tâches en temps réel." 
        },
        stack: ["React", "Node.js", "MongoDB", "Socket.io"],
        github: "https://github.com",
        images: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop"
        ]
    },
    {
        id: 2,
        title: { en: "CryptoViz Dashboard", fr: "Tableau de bord CryptoViz" },
        desc: { 
            en: "A real-time cryptocurrency tracking dashboard with interactive charts and data visualization.", 
            fr: "Un tableau de bord de suivi des cryptomonnaies en temps réel avec des graphiques interactifs." 
        },
        stack: ["Vue.js", "D3.js", "Tailwind CSS"],
        github: "https://github.com",
        images: [
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1200&auto=format&fit=crop"
        ]
    },
    {
        id: 3,
        title: { en: "EcoShop E-commerce", fr: "E-commerce EcoShop" },
        desc: { 
            en: "A sustainable e-commerce platform featuring a modern checkout flow and Stripe integration.", 
            fr: "Une plateforme e-commerce durable avec un flux de paiement moderne et une intégration Stripe." 
        },
        stack: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
        github: "https://github.com",
        images: [
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop"
        ]
    },
    {
        id: 4,
        title: { en: "DevConnect Social", fr: "Réseau DevConnect" },
        desc: { 
            en: "A social network for developers to share projects, find collaborators, and chat.", 
            fr: "Un réseau social pour les développeurs pour partager des projets, trouver des collaborateurs et discuter." 
        },
        stack: ["MERN Stack", "Redux", "JWT"],
        github: "https://github.com",
        images: [
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
        ]
    }
];

const translations = {
    en: {
        nav_about: "About", nav_projects: "Projects", nav_contact: "Contact",
        menu_btn: "Menu",
        page_title: "Web Apps<br>Projects.",
        page_subtitle: "A collection of my recent web applications.",
        back_home: "Back to Home",
        prev_project: "Previous",
        next_project: "Next",
        view_github: "View on GitHub",
        footer_text: "I build stuff."
    },
    fr: {
        nav_about: "À propos", nav_projects: "Réalisations", nav_contact: "Contact",
        menu_btn: "Menu",
        page_title: "Projets<br>Web Apps.",
        page_subtitle: "Une sélection de mes applications web récentes.",
        back_home: "Retour à l'accueil",
        prev_project: "Précédent",
        next_project: "Suivant",
        view_github: "Voir sur GitHub",
        footer_text: "Je construis des trucs."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    let currentLang = 'en';
    let currentProjectIndex = 0;
    let currentImageIndex = 0;
    let imageSlideInterval; // Variable pour le timer du slider

    /* Éléments du DOM */
    const grid = document.getElementById('projects-grid');
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const prevProjectBtn = document.getElementById('prev-project');
    const nextProjectBtn = document.getElementById('next-project');
    const prevImageBtn = document.getElementById('prev-image');
    const nextImageBtn = document.getElementById('next-image');
    const modalSlider = document.getElementById('modal-slider');
    const modalSliderDots = document.getElementById('modal-slider-dots');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalStack = document.getElementById('modal-stack');
    const modalGithub = document.getElementById('modal-github');

    /* 1. GÉNÉRATION DES CARTES */
    function renderGrid() {
        grid.innerHTML = projectsData.map((project, index) => `
            <article class="project-card" data-index="${index}">
                <div class="project-card__image-wrapper">
                    <img src="${project.images[0]}" alt="${project.title[currentLang]}" class="project-card__image">
                    <div class="project-card__overlay">
                        <div class="project-card__overlay-icon">
                            <svg viewBox="0 0 24 24"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                        </div>
                    </div>
                </div>
                <div class="project-card__content">
                    <h2 class="project-card__title">${project.title[currentLang]}</h2>
                    <p class="project-card__desc">${project.desc[currentLang]}</p>
                </div>
            </article>
        `).join('');

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.getAttribute('data-index'));
                openModal(index);
            });
        });
    }

    /* 2. LOGIQUE DU MODAL */
    function openModal(index) {
        currentProjectIndex = index;
        currentImageIndex = 0;
        updateModalContent();
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        startImageAutoPlay(); // Démarre l'auto-play
    }

    function closeModal() {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        stopImageAutoPlay(); // Arrête l'auto-play
    }

    function updateModalContent() {
        const project = projectsData[currentProjectIndex];
        
        modalTitle.textContent = project.title[currentLang];
        modalDesc.textContent = project.desc[currentLang];
        modalGithub.href = project.github;
        
        modalStack.innerHTML = project.stack.map(tech => `<span class="modal__stack-item">${tech}</span>`).join('');

        // Injection des images
        modalSlider.innerHTML = project.images.map((img, i) => 
            `<img src="${img}" class="${i === 0 ? 'active' : ''}" alt="Screenshot ${i+1}">`
        ).join('');

        // 1. Injection des dots
        modalSliderDots.innerHTML = project.images.map((_, i) => 
            `<div class="modal__slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
        ).join('');

        // Écouteurs sur les dots
        modalSliderDots.querySelectorAll('.modal__slider-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentImageIndex = parseInt(e.target.dataset.index);
                updateSliderImage();
                startImageAutoPlay(); // Reset timer
            });
        });

        updateSliderArrows();
        updateProjectNavButtons();
    }

    /* 3. LOGIQUE DU SLIDER D'IMAGES */
    function updateSliderImage() {
        const images = modalSlider.querySelectorAll('img');
        images.forEach((img, i) => {
            img.classList.toggle('active', i === currentImageIndex);
        });

        // Mise à jour des dots
        const dots = modalSliderDots.querySelectorAll('.modal__slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentImageIndex);
        });

        updateSliderArrows();
    }

    function updateSliderArrows() {
        const project = projectsData[currentProjectIndex];
        prevImageBtn.disabled = currentImageIndex === 0;
        nextImageBtn.disabled = currentImageIndex === project.images.length - 1;
    }

    // 1. Fonctions Auto-play
    function startImageAutoPlay() {
        stopImageAutoPlay(); // Évite les doublons
        imageSlideInterval = setInterval(() => {
            const project = projectsData[currentProjectIndex];
            currentImageIndex = (currentImageIndex + 1) % project.images.length;
            updateSliderImage();
        }, 5000);
    }

    function stopImageAutoPlay() {
        clearInterval(imageSlideInterval);
    }

    // Événements flèches
    prevImageBtn.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateSliderImage();
            startImageAutoPlay(); // Reset timer
        }
    });

    nextImageBtn.addEventListener('click', () => {
        const project = projectsData[currentProjectIndex];
        if (currentImageIndex < project.images.length - 1) {
            currentImageIndex++;
            updateSliderImage();
            startImageAutoPlay(); // Reset timer
        }
    });

    /* 4. NAVIGATION ENTRE PROJETS */
    function updateProjectNavButtons() {
        prevProjectBtn.disabled = currentProjectIndex === 0;
        nextProjectBtn.disabled = currentProjectIndex === projectsData.length - 1;
    }

    prevProjectBtn.addEventListener('click', () => {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            currentImageIndex = 0;
            updateModalContent();
            startImageAutoPlay();
        }
    });

    nextProjectBtn.addEventListener('click', () => {
        if (currentProjectIndex < projectsData.length - 1) {
            currentProjectIndex++;
            currentImageIndex = 0;
            updateModalContent();
            startImageAutoPlay();
        }
    });

    closeModalBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });

    /* 5. TRADUCTION */
    function applyLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (key === 'page_title') {
                    element.innerHTML = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        document.querySelectorAll('.header__lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        document.documentElement.lang = lang;

        renderGrid();
        if (modal.classList.contains('is-active')) {
            updateModalContent();
        }
    }

    document.querySelectorAll('.header__lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            applyLanguage(e.currentTarget.getAttribute('data-lang'));
        });
    });

    /* 6. MENU TOGGLE */
    const menuBtn = document.getElementById('menu-btn');
    const navWrapper = document.getElementById('nav-wrapper');
    const spans = menuBtn.querySelectorAll('span');

    menuBtn.addEventListener('click', () => {
        const isActive = navWrapper.classList.toggle('is-active');
        menuBtn.classList.toggle('is-active', isActive);
        
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(2px, 2px)';
            spans[1].style.transform = 'rotate(-45deg) translate(2px, -2px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.transform = 'none';
        }
    });

    /* INITIALISATION */
    renderGrid();
    applyLanguage('en');
});
