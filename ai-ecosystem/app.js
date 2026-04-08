// When this site is shown inside the main index shell (iframe), hide duplicate top nav —
// the main Howell Forge header stays visible above the iframe.
(function markEmbedded() {
  try {
    if (window.self !== window.top) {
      document.documentElement.classList.add("ae-embed");
    }
  } catch (_err) {
    /* cross-origin parent — assume not embedded */
  }
})();

// Match "active tab" behavior with current page in top nav.
(function setActiveTopNav() {
  try {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const links = document.querySelectorAll(".topnav a[href]");
    links.forEach((link) => {
      const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href === file) {
        link.classList.add("active");
      }
    });
  } catch (_err) {
    // non-blocking in staging
  }
})();
