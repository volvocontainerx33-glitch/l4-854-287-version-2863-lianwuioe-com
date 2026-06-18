import { H as Hls } from "./hls.js";

function attachStream(video, stream) {
    if (!video || !stream) {
        return null;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return null;
    }

    if (Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        return hls;
    }

    video.src = stream;
    return null;
}

function initPlayer(player) {
    var video = player.querySelector("video");
    var button = player.querySelector(".play-overlay");
    var stream = video ? video.getAttribute("data-stream") : "";
    var ready = false;
    var hls = null;

    function prepare() {
        if (ready) {
            return;
        }
        hls = attachStream(video, stream);
        player.hls = hls;
        ready = true;
    }

    function play() {
        prepare();
        player.classList.add("is-playing");
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {
                player.classList.remove("is-playing");
            });
        }
    }

    if (button) {
        button.addEventListener("click", play);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            player.classList.add("is-playing");
        });
        video.addEventListener("pause", function () {
            if (!video.ended) {
                player.classList.remove("is-playing");
            }
        });
        video.addEventListener("ended", function () {
            player.classList.remove("is-playing");
        });
    }
}

document.querySelectorAll(".video-player").forEach(initPlayer);
