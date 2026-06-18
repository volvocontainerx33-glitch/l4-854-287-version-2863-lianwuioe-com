function initMoviePlayer(source) {
  var video = document.getElementById("movie-player");
  var trigger = document.getElementById("play-trigger");
  var hlsInstance = null;
  var attached = false;

  if (!video || !trigger || !source) {
    return;
  }

  function attachSource() {
    if (attached) {
      return;
    }
    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function playMovie() {
    attachSource();
    trigger.classList.add("is-hidden");
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        trigger.classList.remove("is-hidden");
      });
    }
  }

  trigger.addEventListener("click", playMovie);
  video.addEventListener("click", function () {
    if (video.paused) {
      playMovie();
    }
  });
  video.addEventListener("play", function () {
    trigger.classList.add("is-hidden");
  });
  video.addEventListener("ended", function () {
    trigger.classList.remove("is-hidden");
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
