import { homeTranslations as translations } from './data/translations.js';

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
            const targetId = link.getAttribute('href');

            if (!targetId || !targetId.startsWith('#')) {
                return;
            }

            e.preventDefault();
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
