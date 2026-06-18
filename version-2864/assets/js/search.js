import { movies } from "./search-data.js";

var params = new URLSearchParams(window.location.search);
var initialQuery = params.get("q") || "";
var input = document.querySelector("[data-search-input]");
var form = document.querySelector("[data-search-form]");
var summary = document.querySelector("[data-search-summary]");
var results = document.getElementById("search-results");

if (input) {
    input.value = initialQuery;
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function card(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
        return "<span>#" + escapeHtml(tag) + "</span>";
    }).join("");

    return "<article class=\"movie-card\">" +
        "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\">" +
            "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">" +
            "<span class=\"poster-year\">" + escapeHtml(movie.year) + "</span>" +
            "<span class=\"poster-score\">" + escapeHtml(movie.score) + "</span>" +
        "</a>" +
        "<div class=\"movie-card-body\">" +
            "<a class=\"movie-title\" href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a>" +
            "<p class=\"movie-desc\">" + escapeHtml(movie.oneLine) + "</p>" +
            "<div class=\"movie-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.genre) + "</span></div>" +
            "<div class=\"movie-tags\">" + tags + "</div>" +
        "</div>" +
    "</article>";
}

function render(query) {
    var value = (query || "").trim().toLowerCase();
    var matched = movies.filter(function (movie) {
        return !value || movie.search.indexOf(value) !== -1;
    }).slice(0, 180);

    if (summary) {
        summary.textContent = value ? "搜索结果：" + matched.length + " 部相关影片" : "输入关键词后显示相关影片";
    }

    if (results) {
        results.innerHTML = matched.map(card).join("");
    }
}

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        var query = input ? input.value : "";
        var url = new URL(window.location.href);
        if (query.trim()) {
            url.searchParams.set("q", query.trim());
        } else {
            url.searchParams.delete("q");
        }
        window.history.replaceState({}, "", url.toString());
        render(query);
    });
}

if (input) {
    input.addEventListener("input", function () {
        render(input.value);
    });
}

render(initialQuery);
