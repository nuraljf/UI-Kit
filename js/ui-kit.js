/* ============================================================
   UI'Kit — interaction layer
   Small, dependency-free behaviours so the static showcase
   feels alive. Everything here is optional; the components
   render correctly with CSS alone.
   ============================================================ */
(function () {
  "use strict";

  /* --- Responsive stage -------------------------------------
     The frame is authored at 1440x1024. Scale it down to fit
     narrower viewports while preserving the exact ratio.       */
  var STAGE_W = 1440;
  var STAGE_H = 1024;

  function fitStage() {
    var stage = document.getElementById("stage");
    if (!stage) return;
    var available = document.documentElement.clientWidth - 48; // 24px padding each side
    var scale = Math.min(1, available / STAGE_W);
    stage.style.transform = "scale(" + scale + ")";
    // collapse the empty space left by the transform
    stage.parentElement.style.height = STAGE_H * scale + "px";
  }

  window.addEventListener("resize", fitStage);
  document.addEventListener("DOMContentLoaded", fitStage);
  fitStage();

  /* --- Segmented control selection --------------------------
     Click a cell to make it the active one in its group.       */
  document.querySelectorAll("[data-segmented]").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var cell = e.target.closest(".ui-btn");
      if (!cell || !group.contains(cell)) return;
      group.querySelectorAll(".ui-btn").forEach(function (b) {
        b.removeAttribute("aria-pressed");
      });
      cell.setAttribute("aria-pressed", "true");
    });
  });
})();
