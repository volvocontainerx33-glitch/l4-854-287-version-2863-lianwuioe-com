(function () {
  function initPlayer(box) {
    var video = box.querySelector('video');
    var overlay = box.querySelector('[data-player-overlay]');
    var button = box.querySelector('[data-player-button]');
    var source = box.getAttribute('data-video');
    var ready = false;
    var hls = null;

    function attach() {
      if (ready || !video || !source) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      if (!video) {
        return;
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    }

    function showOverlay() {
      if (overlay && video && video.paused) {
        overlay.classList.remove('hidden');
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }
    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        play();
      });
    }
    if (video) {
      video.addEventListener('play', hideOverlay);
      video.addEventListener('pause', showOverlay);
      video.addEventListener('ended', showOverlay);
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initPlayer);
  });
})();
