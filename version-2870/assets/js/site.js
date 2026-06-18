
(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero-carousel]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var active = 0;
        var show = function (index) {
            active = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        };
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                show((active + 1) % slides.length);
            }, 5600);
        }
    }

    var filterForm = document.querySelector('[data-filter-form]');
    if (filterForm) {
        var input = filterForm.querySelector('[data-filter-input]');
        var year = filterForm.querySelector('[data-filter-year]');
        var region = filterForm.querySelector('[data-filter-region]');
        var type = filterForm.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var empty = document.querySelector('[data-no-results]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && input) {
            input.value = query;
        }
        var apply = function () {
            var text = (input && input.value ? input.value : '').trim().toLowerCase();
            var y = year && year.value ? year.value : '';
            var r = region && region.value ? region.value : '';
            var t = type && type.value ? type.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var hay = card.getAttribute('data-search') || '';
                var matchText = !text || hay.indexOf(text) !== -1;
                var matchYear = !y || card.getAttribute('data-year') === y;
                var matchRegion = !r || card.getAttribute('data-region') === r;
                var matchType = !t || card.getAttribute('data-type') === t;
                var ok = matchText && matchYear && matchRegion && matchType;
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };
        filterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            apply();
        });
        [input, year, region, type].forEach(function (item) {
            if (item) {
                item.addEventListener('input', apply);
                item.addEventListener('change', apply);
            }
        });
        apply();
    }

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
        var video = player.querySelector('video');
        var layer = player.querySelector('[data-play-layer]');
        var streamUrl = player.getAttribute('data-stream');
        var started = false;

        var start = function () {
            if (!video || !streamUrl) {
                return;
            }
            if (!started) {
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    video._hls = hls;
                } else {
                    video.src = streamUrl;
                }
                started = true;
            }
            if (layer) {
                layer.classList.add('is-hidden');
            }
            video.setAttribute('controls', 'controls');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        };

        if (layer) {
            layer.addEventListener('click', start);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (!started || video.paused) {
                    start();
                }
            });
        }
    });
}());
