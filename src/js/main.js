import { initLoader } from './components/loader.js';

const pageModules = {
  'home-page': './home.js',
  'projects-page': './projects.js',
  'error-page': './error.js'
};

if (document.body.classList.contains('home-page')
  || document.body.classList.contains('projects-page')) {
  initLoader();
}

const pageModule = Object.entries(pageModules)
  .find(([pageClass]) => document.body.classList.contains(pageClass));

if (pageModule) {
  import(pageModule[1]);
}
