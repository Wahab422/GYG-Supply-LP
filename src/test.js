function handleWeglot() {
    //   Lang Toggle
    (() => {
      let langToggles = document.querySelectorAll('.lang-toggle');
      if (langToggles.length < 1) return;
      langToggles.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          let langDropdown = btn.closest('.lang-dropdown');
          event.stopPropagation(); // Prevent the click from bubbling to the document
          langDropdown.classList.toggle('open');
  
          document.addEventListener('click', (event) => {
            if (!langDropdown.contains(event.target) && !event.target.closest('[slide-to]')) {
              langDropdown.classList.remove('open'); // Close if clicked outside
            }
          });
        });
      });
    })();
    // init Weglot
    Weglot.initialize({
      api_key: 'wg_bb2924345b48f25dde987ebf8015b20a4',
    });
  
    document.querySelectorAll('.lang-dropdown [lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        let lang = btn.getAttribute('lang');
        document.querySelectorAll('[lang-text]').forEach((text) => (text.innerHTML = lang));
        Weglot.switchTo(lang);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    });
  
    Weglot.on('languageChanged', function (newLang, prevLang) {
      document.querySelectorAll('[lang-text]').forEach((text) => (text.innerHTML = newLang));
      document.querySelectorAll('[form-success-pdf-link]').forEach((link) => {
        link.setAttribute(
          'href',
          link
            .closest('[get-access-form-wrapper]')
            .querySelector('form')
            .getAttribute(`data-pdf-${newLang}`)
        );
      });
    });
    Weglot.on('initialized', () => {
      let currentLanguage = Weglot.getCurrentLang();
      document.querySelectorAll('[data-wg-lang-element]').forEach((ele) => {
        if (ele.getAttribute('data-wg-lang-element') !== currentLanguage) {
          ele.remove();
        }
      });
    });
  }