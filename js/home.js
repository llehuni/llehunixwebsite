const translations = {
    en: {
        nav_about: "About", nav_projects: "Projects", nav_contact: "Contact",
        menu_btn: "Menu",
        title: "Bent Lindberg<br>Digital Designer",
        location: "(Berlin, Germany)",
        scroll_down: "Scroll Down",
        about_label: "(About Me)",
        about_texts: [
            "As a digital designer, I focus on producing top-notch and impactful digital experiences.",
            "I collaborate closely with ambitious brands to translate their vision into stunning visual identities.",
            "My approach combines strategic thinking with meticulous attention to detail to deliver results."
        ],
        btn_cv: "Download my CV", btn_projects: "See my projects",
        contact_label: "(How to contact me)",
        footer_text: "I build stuff."
    },
    fr: {
        nav_about: "À propos", nav_projects: "Réalisations", nav_contact: "Contact",
        menu_btn: "Menu",
        title: "Bent Lindberg<br>Designer Digital",
        location: "(Berlin, Allemagne)",
        scroll_down: "Défiler vers le bas",
        about_label: "(À propos de moi)",
        about_texts: [
            "En tant que designer digital, je me concentre sur la création d'expériences numériques de premier ordre et à fort impact.",
            "Je collabore étroitement avec des marques ambitieuses pour traduire leur vision en identités visuelles époustouflantes.",
            "Mon approche combine une réflexion stratégique et une attention méticuleuse aux détails pour livrer des résultats."
        ],
        btn_cv: "Télécharger mon CV", btn_projects: "Voir mes réalisations",
        contact_label: "(Comment me contacter)",
        footer_text: "Je construis des trucs."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    let currentLang = 'en';
    let currentSlide = 0;
    let slideInterval;
    const textElement = document.getElementById('about-text');
    const dots = document.querySelectorAll('.about__dot');

    function changeSlide(index) {
        textElement.style.opacity = '0';
        setTimeout(() => {
            textElement.textContent = translations[currentLang].about_texts[index];
            textElement.style.opacity = '1';
        }, 200);
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function startAutoPlay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            changeSlide((currentSlide + 1) % 3);
        }, 5000);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlide(index);
            startAutoPlay();
        });
    });

    function applyLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (key === 'title') {
                    element.innerHTML = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        textElement.textContent = translations[lang].about_texts[currentSlide];
        document.querySelectorAll('.header__lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        document.documentElement.lang = lang;
    }

    document.querySelectorAll('.header__lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            applyLanguage(e.currentTarget.getAttribute('data-lang'));
        });
    });

    startAutoPlay();
    applyLanguage('en');

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

    function smoothScrollTo(targetY, duration = 1200) {
        const startY = window.scrollY;
        const difference = targetY - startY;
        const startTime = performance.now();
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(0, startY + difference * ease);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    document.querySelectorAll('.header__nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                navWrapper.classList.remove('is-active');
                menuBtn.classList.remove('is-active');
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
                
                setTimeout(() => {
                    const targetY = target.getBoundingClientRect().top + window.scrollY;
                    smoothScrollTo(targetY, 1200);
                }, 300);
            }
        });
    });
});
