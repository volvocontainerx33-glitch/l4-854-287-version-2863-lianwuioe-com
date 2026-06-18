(function() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const count = document.getElementById('searchCount');
  const form = document.querySelector('.js-search-page-form');
  const data = window.SITE_SEARCH_DATA || [];
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function card(movie) {
    const tags = (movie.tags || []).slice(0, 3).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card js-movie-card">',
      '  <a class="movie-poster" href="' + escapeHtml(movie.href) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-shade"></span>',
      '    <span class="duration">' + escapeHtml(movie.duration) + '</span>',
      '  </a>',
      '  <div class="movie-info">',
      '    <div class="movie-meta-line"><a href="./categories.html">' + escapeHtml(movie.channel) + '</a><span>' + escapeHtml(movie.year) + '</span></div>',
      '    <h3><a href="' + escapeHtml(movie.href) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.summary) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '    <div class="card-stats"><span>' + escapeHtml(movie.region) + '</span><span>' + Number(movie.views).toLocaleString() + ' 观看</span><span>' + escapeHtml(movie.rating) + ' 分</span></div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function render(query) {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      count.textContent = '输入关键词后显示匹配结果';
      return;
    }

    const matched = data.filter(function(movie) {
      const source = [
        movie.title,
        movie.channel,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.summary
      ].join(' ').toLowerCase();
      return source.indexOf(keyword) !== -1;
    }).slice(0, 120);

    count.textContent = '找到 ' + matched.length + ' 个相关结果';

    if (!matched.length) {
      results.innerHTML = '<div class="story-card"><h2>未找到相关影片</h2><p>可以尝试输入地区、年份、题材或更短的关键词。</p></div>';
      return;
    }

    results.innerHTML = matched.map(card).join('');
  }

  if (input) {
    input.value = initial;
    render(initial);
    input.addEventListener('input', function() {
      render(input.value);
    });
  }

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const query = input.value.trim();
      const next = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
      window.history.replaceState({}, '', next);
      render(query);
    });
  }
})();
