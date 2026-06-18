import { H as Hls } from './hls.js';

function initPlayer(box) {
  const video = box.querySelector('video');
  const button = box.querySelector('.player-overlay');
  const src = box.getAttribute('data-src');
  let ready = false;
  let hls = null;

  function bind() {
    if (ready) {
      return Promise.resolve();
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    return new Promise(function(resolve) {
      const done = function() {
        resolve();
      };
      video.addEventListener('loadedmetadata', done, { once: true });
      window.setTimeout(done, 700);
    });
  }

  function play() {
    box.classList.add('is-playing');
    bind().then(function() {
      const action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function() {});
      }
    });
  }

  button.addEventListener('click', play);
  video.addEventListener('click', function() {
    if (!ready || video.paused) {
      play();
    }
  });

  window.addEventListener('beforeunload', function() {
    if (hls) {
      hls.destroy();
    }
  });
}

document.querySelectorAll('.js-player').forEach(initPlayer);
