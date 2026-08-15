/* sober 主题交互脚本 */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- 深浅色模式切换 ---------- */
  var btn = document.getElementById("themeToggle");
  var stored = localStorage.getItem("sober-theme");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (btn) btn.textContent = theme === "dark" ? "☀" : "☾";
  }

  if (stored) {
    apply(stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    apply("dark");
  } else {
    apply("light");
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      localStorage.setItem("sober-theme", next);
    });
  }

  /* ---------- 汉堡菜单 ---------- */
  var menuBtn = document.getElementById("menuToggle");
  var menuPanel = document.getElementById("menuPanel");
  var menuOverlay = document.getElementById("menuOverlay");

  function openMenu() {
    if (menuPanel) menuPanel.classList.add("open");
    if (menuOverlay) menuOverlay.classList.add("show");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (menuPanel) menuPanel.classList.remove("open");
    if (menuOverlay) menuOverlay.classList.remove("show");
    document.body.classList.remove("menu-open");
  }

  if (menuBtn) menuBtn.addEventListener("click", function () {
    if (menuPanel && menuPanel.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (menuOverlay) menuOverlay.addEventListener("click", closeMenu);

  // 点击菜单项后自动关闭
  if (menuPanel) {
    menuPanel.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") closeMenu();
    });
  }

  // Esc 关闭
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
})();
