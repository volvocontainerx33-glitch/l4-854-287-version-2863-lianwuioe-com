(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
        });
    }

    document.querySelectorAll('.js-hero').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var index = Math.max(0, slides.findIndex(function (slide) {
            return slide.classList.contains('is-active');
        }));
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        if (slides.length > 1) {
            start();
        }
    });

    var query = new URLSearchParams(window.location.search).get('q') || '';
    document.querySelectorAll('.js-search').forEach(function (input) {
        if (query) {
            input.value = query;
        }
        var panel = input.closest('.filter-panel') || document;
        var grid = document.querySelector('.js-filter-grid');
        var activeFilter = 'all';
        var chips = Array.prototype.slice.call(panel.querySelectorAll('.filter-chip'));

        function apply() {
            var term = input.value.trim().toLowerCase();
            if (!grid) {
                return;
            }
            Array.prototype.slice.call(grid.querySelectorAll('.movie-card')).forEach(function (card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-type') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-tags') || ''
                ].join(' ').toLowerCase();
                var passTerm = !term || text.indexOf(term) !== -1;
                var passFilter = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
                card.classList.toggle('is-hidden', !(passTerm && passFilter));
            });
        }

        input.addEventListener('input', apply);
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                activeFilter = chip.getAttribute('data-filter') || 'all';
                chips.forEach(function (item) {
                    item.classList.toggle('is-active', item === chip);
                });
                apply();
            });
        });
        apply();
    });

    function bindPlayer(player) {
        var video = player.querySelector('.js-video');
        var button = player.querySelector('.play-overlay');
        var src = player.getAttribute('data-video');
        var hlsInstance = null;

        function attach() {
            if (!video || !src || video.dataset.ready === '1') {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(video);
            } else {
                video.src = src;
            }
            video.dataset.ready = '1';
        }

        function play() {
            attach();
            player.classList.add('is-playing');
            if (video) {
                var result = video.play();
                if (result && typeof result.catch === 'function') {
                    result.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }
        if (video) {
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
        }
        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.querySelectorAll('.player-card').forEach(bindPlayer);
})();
