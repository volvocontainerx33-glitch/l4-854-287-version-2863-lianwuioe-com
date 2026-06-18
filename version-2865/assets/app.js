(function() {
  const menuButton = document.querySelector('.js-menu-button');
  const mobilePanel = document.querySelector('.js-mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function() {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.js-search-form').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      const input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  const hero = document.querySelector('.js-hero');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    let index = 0;
    let timer = null;

    const show = function(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const start = function() {
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    };

    const stop = function() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        stop();
        show(Number(dot.dataset.slide || 0));
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    if (slides.length > 1) {
      start();
    }
  }

  const scopes = document.querySelectorAll('.js-filter-scope');
  scopes.forEach(function(scope) {
    const section = scope.closest('.content-section') || document;
    const search = section.querySelector('.js-card-search');
    const chips = Array.from(section.querySelectorAll('.js-filter-chip'));
    const cards = Array.from(scope.querySelectorAll('.js-movie-card'));
    let activeFilter = '';

    const apply = function() {
      const query = search ? search.value.trim().toLowerCase() : '';
      cards.forEach(function(card) {
        const text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.type,
          card.dataset.channel,
          card.textContent
        ].join(' ').toLowerCase();
        const matchesQuery = !query || text.indexOf(query) !== -1;
        const matchesFilter = !activeFilter || text.indexOf(activeFilter.toLowerCase()) !== -1;
        card.classList.toggle('is-hidden', !(matchesQuery && matchesFilter));
      });
    };

    if (search) {
      search.addEventListener('input', apply);
    }

    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(item) {
          item.classList.remove('is-active');
        });
        chip.classList.add('is-active');
        activeFilter = chip.dataset.filter || '';
        apply();
      });
    });
  });
})();
