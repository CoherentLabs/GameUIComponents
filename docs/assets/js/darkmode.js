const mode = document.getElementById('mode');

if (mode !== null) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-dark-mode', '');
      document.body.classList.add('c_darkmode');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.removeAttribute('data-dark-mode');
      document.body.classList.remove('c_darkmode');
    }
  })

  mode.addEventListener('click', () => {
    document.documentElement.toggleAttribute('data-dark-mode');

    const bodyClassList = document.body.classList;
    const isDarkModeSet = document.documentElement.hasAttribute('data-dark-mode');
    localStorage.setItem('theme', isDarkModeSet ? 'dark' : 'light');

    isDarkModeSet ? bodyClassList.add('c_darkmode') : bodyClassList.remove('c_darkmode');
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-dark-mode', '');
    document.body.classList.add('c_darkmode');
  } else {
    document.documentElement.removeAttribute('data-dark-mode');
    document.body.classList.remove('c_darkmode');
  }
}
