"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/test.js
  var logoWrapper = document.querySelector(".logo-screen");
  var logos = document.querySelectorAll(".logo-item");
  gsap.set(logos, { autoAlpha: 1 });
  var listHeight = logoWrapper.scrollHeight;
  var duration = logos.length * 2.5;
  gsap.to(logoWrapper, {
    yPercent: -100,
    // Move the entire list upwards
    duration,
    ease: "none",
    repeat: -1,
    // Infinite loop
    modifiers: {
      yPercent: gsap.utils.wrap(0, -100)
      // Wrap the movement to loop it continuously
    }
  });
})();
//# sourceMappingURL=test.js.map
