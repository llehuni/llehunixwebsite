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
  document.body.classList.add('page-content-ready');
  mainContent?.classList.add('is-visible');
  document.body.style.overflow = '';

  setTimeout(() => loader.remove(), 1800);
  return content;
}

export function initLoader() {
  const loader = document.getElementById('loader');
  const wordmark = document.getElementById('loader-wordmark');
  const counter = document.getElementById('loader-counter');
  const progress = document.getElementById('loader-progress');

  if (!loader || !wordmark || !counter || !progress) {
    throw new Error('Unable to initialize the page loader.');
  }

  loader.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

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
