"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/test.js
  var button = document.querySelector("#btn");
  var textSpan = document.createElement("span");
  textSpan.textContent = "Like";
  function onClick() {
    confetti({
      particleCount: 150,
      spread: 60
    });
  }
  button.addEventListener("click", onClick);
})();
//# sourceMappingURL=test.js.map
