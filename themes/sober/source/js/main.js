/* sober 主题交互脚本 */
(function () {
  "use strict";

  // 深浅色模式切换（记忆用户选择）
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  var stored = localStorage.getItem("sober-theme");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (btn) btn.textContent = theme === "dark" ? "☀" : "☾";
  }

  // 初始：优先用户记忆，否则跟随系统
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
})();
