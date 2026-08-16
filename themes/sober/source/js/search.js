/* sober 主题：站内搜索 + 强调色切换（无 npm 依赖） */
(function () {
  "use strict";

  /* ================= 站点根路径探测 ================= */
  var root = "/";
  var logo = document.querySelector(".site-name");
  if (logo && logo.getAttribute("href")) {
    root = logo.getAttribute("href");
    if (root[root.length - 1] !== "/") root += "/";
  }

  /* ================= 强调色切换（data-color） ================= */
  var rootEl = document.documentElement;
  var colorBtn = document.getElementById("colorToggle");
  var colorPop = document.getElementById("colorPop");
  var colorOverlay = document.getElementById("colorOverlay");
  var colorOptions = document.getElementById("colorOptions");

  // 从 localStorage 恢复（兼容旧版 data-bg 迁移）
  var storedColor = localStorage.getItem("sober-color");
  if (!storedColor) storedColor = localStorage.getItem("sober-bg");
  if (storedColor) rootEl.setAttribute("data-color", storedColor);

  function syncActive() {
    var cur = rootEl.getAttribute("data-color") || "blue";
    var opts = colorOptions ? colorOptions.querySelectorAll(".color-option") : [];
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].getAttribute("data-color") === cur) opts[i].classList.add("active");
      else opts[i].classList.remove("active");
    }
  }

  if (colorBtn && colorPop) {
    colorBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var show = colorPop.classList.toggle("show");
      if (colorOverlay) colorOverlay.classList.toggle("show", show);
      if (show) syncActive();
    });
    if (colorOverlay) {
      colorOverlay.addEventListener("click", function () {
        colorPop.classList.remove("show");
        colorOverlay.classList.remove("show");
      });
    }
    if (colorOptions) {
      colorOptions.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest(".color-option") : null;
        if (!btn) return;
        var c = btn.getAttribute("data-color");
        if (!c) return;
        rootEl.setAttribute("data-color", c);
        localStorage.setItem("sober-color", c);
        localStorage.removeItem("sober-bg");
        syncActive();
        setTimeout(function () {
          colorPop.classList.remove("show");
          if (colorOverlay) colorOverlay.classList.remove("show");
        }, 350);
      });
    }
  }

  /* ================= 站内搜索 ================= */
  var searchBtn = document.getElementById("searchToggle");
  var searchOverlay = document.getElementById("searchOverlay");
  var searchPanel = document.querySelector(".search-panel");
  var searchInput = document.getElementById("searchInput");
  var searchResults = document.getElementById("searchResults");
  var searchClose = document.getElementById("searchClose");
  var searchData = null;

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("show");
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 60);
    loadData();
  }
  function closeSearch() {
    if (searchOverlay) searchOverlay.classList.remove("show");
  }

  if (searchBtn) searchBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    openSearch();
  });
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener("click", function (e) {
      if (searchPanel && !searchPanel.contains(e.target)) closeSearch();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
  });

  if (searchPanel) {
    searchPanel.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  function loadData() {
    if (searchData) return;
    var url = root + "search.json";
    fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) { searchData = data.posts || []; })
      .catch(function () { searchData = []; });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function highlight(text, q) {
    if (!text || !q) return esc(text);
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return esc(text).replace(re, "<mark>$1</mark>");
  }

  function render(query) {
    if (!searchResults) return;
    var q = (query || "").trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '<div class="search-empty">输入关键词开始搜索…</div>';
      return;
    }
    if (!searchData) {
      searchResults.innerHTML = '<div class="search-empty">搜索数据加载中…</div>';
      return;
    }
    if (!searchData.length) {
      searchResults.innerHTML = '<div class="search-empty">暂无搜索数据（请先推送构建）</div>';
      return;
    }

    var hits = searchData.filter(function (p) {
      var hay = ((p.title || "") + " " + (p.content || "") + " " + (p.tags || []).join(" ") + " " + (p.categories || []).join(" ")).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    if (!hits.length) {
      searchResults.innerHTML = '<div class="search-empty">没有找到与 “' + esc(query) + '” 相关的文章</div>';
      return;
    }

    var html = hits.slice(0, 20).map(function (p) {
      var tags = (p.tags || []).map(function (t) { return "#" + esc(t); }).join(" ");
      var cats = (p.categories || []).join(" ");
      var content = p.content || "";
      var idx = content.toLowerCase().indexOf(q);
      var excerpt = "";
      if (idx >= 0) {
        var start = Math.max(0, idx - 40);
        var end = Math.min(content.length, idx + q.length + 60);
        excerpt = (start > 0 ? "…" : "") + content.slice(start, end) + (end < content.length ? "…" : "");
      } else {
        excerpt = content.slice(0, 80);
      }
      var meta = [];
      if (p.date) meta.push("🗓 " + esc(p.date));
      if (cats) meta.push("📂 " + esc(cats));
      if (tags) meta.push("🏷️ " + tags);
      return (
        '<a class="search-item" href="' + esc(p.path) + '">' +
          '<div class="search-item-title">📄 ' + highlight(p.title, query) + '</div>' +
          '<div class="search-item-meta">' + meta.join("") + '</div>' +
          '<div class="search-item-excerpt">' + highlight(excerpt, query) + '</div>' +
        '</a>'
      );
    }).join("");

    searchResults.innerHTML = html;
  }

  if (searchInput) {
    var timer = null;
    searchInput.addEventListener("input", function () {
      var val = searchInput.value;
      clearTimeout(timer);
      timer = setTimeout(function () { render(val); }, 120);
    });
  }
})();
