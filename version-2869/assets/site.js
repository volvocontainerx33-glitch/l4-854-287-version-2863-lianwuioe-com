import { H as Hls } from './hls-dru42stk.js';

const body = document.body;

function initMobileMenu() {
    const button = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-nav]');

    if (!button || !menu) {
        return;
    }

    button.addEventListener('click', () => {
        menu.classList.toggle('open');
        body.classList.toggle('no-scroll', menu.classList.contains('open'));
    });
}

function initHeroSlider() {
    const hero = document.querySelector('[data-hero]');

    if (!hero) {
        return;
    }

    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const previous = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function show(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === current);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    function restart() {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(current + 1), 5600);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            show(index);
            restart();
        });
    });

    previous?.addEventListener('click', () => {
        show(current - 1);
        restart();
    });

    next?.addEventListener('click', () => {
        show(current + 1);
        restart();
    });

    if (slides.length > 1) {
        restart();
    }
}

function normalize(value) {
    return String(value || '').trim().toLowerCase();
}

function initFilters() {
    const input = document.querySelector('[data-search-input]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const counter = document.querySelector('[data-result-count]');

    if (!input || cards.length === 0) {
        return;
    }

    const parameters = new URLSearchParams(window.location.search);
    const initialQuery = parameters.get('q');

    if (initialQuery) {
        input.value = initialQuery;
    }

    function update() {
        const query = normalize(input.value);
        let visibleCount = 0;

        cards.forEach((card) => {
            const haystack = normalize(card.dataset.search || card.textContent);
            const isVisible = !query || haystack.includes(query);
            card.classList.toggle('is-hidden', !isVisible);

            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (counter) {
            counter.textContent = query
                ? `匹配到 ${visibleCount} 条结果`
                : `正在显示全部 ${visibleCount} 条`;
        }
    }

    input.addEventListener('input', update);
    update();
}

function initVideoPlayers() {
    const players = Array.from(document.querySelectorAll('[data-video-player]'));

    players.forEach((player) => {
        const video = player.querySelector('video');
        const playButton = player.querySelector('[data-play]');
        const status = player.querySelector('[data-status]');
        const source = player.dataset.src;
        let hasLoaded = false;
        let hlsInstance = null;

        if (!video || !source) {
            return;
        }

        function setStatus(message) {
            if (status) {
                status.textContent = message;
            }
        }

        function loadSource() {
            if (hasLoaded) {
                return;
            }

            hasLoaded = true;
            setStatus('正在加载 HLS 播放源...');

            if (Hls && Hls.isSupported()) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                    setStatus('播放源加载完成');
                });
                hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
                    if (data && data.fatal) {
                        setStatus('视频加载失败，请检查网络后重试');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', () => {
                    setStatus('播放源加载完成');
                }, { once: true });
            } else {
                setStatus('当前浏览器不支持 HLS 播放');
            }
        }

        async function togglePlay() {
            loadSource();

            try {
                if (video.paused) {
                    await video.play();
                    player.classList.add('is-playing');
                } else {
                    video.pause();
                    player.classList.remove('is-playing');
                }
            } catch (error) {
                setStatus('浏览器阻止自动播放，请再次点击播放按钮');
            }
        }

        playButton?.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);
        video.addEventListener('play', () => player.classList.add('is-playing'));
        video.addEventListener('pause', () => player.classList.remove('is-playing'));
        window.addEventListener('beforeunload', () => {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
}

initMobileMenu();
initHeroSlider();
initFilters();
initVideoPlayers();
