export function createProjectModal({ projects, elements }) {
    let currentProjectIndex = 0;
    let currentImageIndex = 0;
    let imageSlideInterval;

    function updateSliderArrows() {
        const project = projects[currentProjectIndex];
        elements.prevImage.disabled = currentImageIndex === 0;
        elements.nextImage.disabled = currentImageIndex === project.images.length - 1;
    }

    function updateSliderImage() {
        elements.slider.querySelectorAll('img').forEach((image, index) => {
            image.classList.toggle('active', index === currentImageIndex);
        });
        elements.sliderDots.querySelectorAll('.modal__slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentImageIndex);
        });
        updateSliderArrows();
    }

    function stopImageAutoPlay() {
        clearInterval(imageSlideInterval);
    }

    function startImageAutoPlay() {
        stopImageAutoPlay();
        imageSlideInterval = setInterval(() => {
            const project = projects[currentProjectIndex];
            currentImageIndex = (currentImageIndex + 1) % project.images.length;
            updateSliderImage();
        }, 5000);
    }

    function updateProjectNavButtons() {
        elements.prevProject.disabled = currentProjectIndex === 0;
        elements.nextProject.disabled = currentProjectIndex === projects.length - 1;
    }

    function updateContent(language) {
        const project = projects[currentProjectIndex];
        elements.title.textContent = project.title[language];
        elements.description.textContent = project.desc[language];
        elements.github.href = project.github;
        elements.stack.innerHTML = project.stack
            .map(technology => `<span class="modal__stack-item">${technology}</span>`)
            .join('');
        elements.slider.innerHTML = project.images
            .map((image, index) => `
                <img src="${image}" class="${index === 0 ? 'active' : ''}" alt="Screenshot ${index + 1}">
            `)
            .join('');
        elements.sliderDots.innerHTML = project.images
            .map((_, index) => `
                <div class="modal__slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
            `)
            .join('');

        elements.sliderDots.querySelectorAll('.modal__slider-dot').forEach(dot => {
            dot.addEventListener('click', event => {
                currentImageIndex = Number(event.currentTarget.dataset.index);
                updateSliderImage();
                startImageAutoPlay();
            });
        });

        updateSliderArrows();
        updateProjectNavButtons();
    }

    function close() {
        elements.modal.classList.remove('is-active');
        document.body.style.overflow = '';
        stopImageAutoPlay();
    }

    function open(index, language) {
        currentProjectIndex = index;
        currentImageIndex = 0;
        updateContent(language);
        elements.modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        startImageAutoPlay();
    }

    elements.prevImage.addEventListener('click', () => {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateSliderImage();
            startImageAutoPlay();
        }
    });

    elements.nextImage.addEventListener('click', () => {
        const project = projects[currentProjectIndex];
        if (currentImageIndex < project.images.length - 1) {
            currentImageIndex++;
            updateSliderImage();
            startImageAutoPlay();
        }
    });

    elements.prevProject.addEventListener('click', () => {
        if (currentProjectIndex > 0) {
            currentProjectIndex--;
            currentImageIndex = 0;
            updateContent(elements.getLanguage());
            startImageAutoPlay();
        }
    });

    elements.nextProject.addEventListener('click', () => {
        if (currentProjectIndex < projects.length - 1) {
            currentProjectIndex++;
            currentImageIndex = 0;
            updateContent(elements.getLanguage());
            startImageAutoPlay();
        }
    });

    elements.close.addEventListener('click', close);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && elements.modal.classList.contains('is-active')) {
            close();
        }
    });

    return { open, close, updateContent };
}
