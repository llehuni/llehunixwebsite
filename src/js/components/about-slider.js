export function initAboutSlider({ translations, textElement, dots }) {
    let currentSlide = 0;
    let slideInterval;
    let currentTranslations = translations;

    function changeSlide(index) {
        textElement.style.opacity = '0';
        setTimeout(() => {
            textElement.textContent = currentTranslations.about_texts[index];
            textElement.style.opacity = '1';
        }, 200);
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function startAutoPlay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            changeSlide((currentSlide + 1) % dots.length);
        }, 5000);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlide(index);
            startAutoPlay();
        });
    });

    startAutoPlay();

    return {
        setLanguage(translationsForLanguage) {
            currentTranslations = translationsForLanguage;
            textElement.textContent = currentTranslations.about_texts[currentSlide];
        }
    };
}
