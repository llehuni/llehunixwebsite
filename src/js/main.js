const pageModules = {
  'home-page': './home.js',
  'projects-page': './projects.js',
  'error-page': './error.js'
};

const pageModule = Object.entries(pageModules)
  .find(([pageClass]) => document.body.classList.contains(pageClass));

if (pageModule) {
  import(pageModule[1]);
}
