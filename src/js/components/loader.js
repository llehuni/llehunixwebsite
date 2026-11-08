const loaderMarkup = `
  <div class="loader" id="loader" aria-label="Loading">
    <div class="loader__content">
      <div class="loader__top">
        <span>Portfolio © ${new Date().getFullYear()}</span>
        <span>Loading</span>
      </div>

      <div class="loader__center">
        <div class="loader__wordmark" id="loader-wordmark">
          <div class="loader__line" data-text="LaGrace"></div>
          <div class="loader__line" data-text="Lehuni"></div>
        </div>
        <div class="loader__subtitle">Software Engineer</div>
      </div>

      <div class="loader__bottom">
        <div class="loader__progress-track">
          <div class="loader__progress-fill" id="loader-progress"></div>
        </div>
        <div class="loader__counter" id="loader-counter">000</div>
      </div>
    </div>
  </div>
`;

const duration = 2200;

function splitWordmark(wordmark) {
  let letterIndex = 0;

  wordmark.querySelectorAll('.loader__line').forEach(line => {
    [...line.dataset.text].forEach(character => {
      const letter = document.createElement('span');
      letter.className = 'loader__letter';
      letter.style.setProperty('--i', letterIndex);
      letter.textContent = character;
      line.append(letter);
      letterIndex += 1;
    });
  });
}

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress ** 3
    : 1 - ((-2 * progress + 2) ** 3) / 2;
}

function finishLoading(loader) {
  const content = loader.querySelector('.loader__content');
  const mainContent = document.querySelector('.main-content');

  loader.classList.add('is-loaded');
  mainContent?.classList.add('is-visible');
  document.body.style.overflow = '';

  setTimeout(() => loader.remove(), 1800);
  return content;
}

export function initLoader() {
  document.body.insertAdjacentHTML('beforebegin', loaderMarkup);

  const loader = document.getElementById('loader');
  const wordmark = document.getElementById('loader-wordmark');
  const counter = document.getElementById('loader-counter');
  const progress = document.getElementById('loader-progress');

  if (!loader || !wordmark || !counter || !progress) {
    throw new Error('Unable to initialize the page loader.');
  }

  document.body.style.overflow = 'hidden';
  splitWordmark(wordmark);

  const startTime = performance.now() + 200;

  function animate(now) {
    const elapsed = now - startTime;

    if (elapsed < 0) {
      requestAnimationFrame(animate);
      return;
    }

    const currentProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(currentProgress);

    counter.textContent = String(Math.floor(easedProgress * 100)).padStart(3, '0');
    progress.style.transform = `scaleX(${easedProgress})`;

    if (currentProgress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    counter.textContent = '100';
    progress.style.transform = 'scaleX(1)';
    setTimeout(() => finishLoading(loader), 400);
  }

  requestAnimationFrame(animate);
}
