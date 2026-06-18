(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === current);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 6200);
    }

    function resetHero() {
        if (timer) {
            window.clearInterval(timer);
        }
        startHero();
    }

    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(current - 1);
            resetHero();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(current + 1);
            resetHero();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            resetHero();
        });
    });

    startHero();

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
        var input = panel.querySelector("[data-card-search]");
        var buttons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-value]"));
        var scope = panel.parentElement || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
        var activeFilter = "all";

        function filterCards() {
            var query = input ? input.value.trim().toLowerCase() : "";

            cards.forEach(function (card) {
                var haystack = card.getAttribute("data-search") || "";
                var attrs = [
                    card.getAttribute("data-type") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-genre") || ""
                ].join(" ");
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesFilter = activeFilter === "all" || attrs.indexOf(activeFilter) !== -1;
                card.hidden = !(matchesQuery && matchesFilter);
            });
        }

        if (input) {
            input.addEventListener("input", filterCards);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                activeFilter = button.getAttribute("data-filter-value") || "all";
                buttons.forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });
                filterCards();
            });
        });
    });
})();
