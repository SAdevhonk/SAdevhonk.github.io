(function () {
  const KEY = "cookie_consent_v1";

  function setConsent(value) {
    localStorage.setItem(KEY, value);

    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: value,
      });
    }

    hideBanner();
  }

  function hideBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "none";
  }

  function showBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "block";
  }

  const saved = localStorage.getItem(KEY);

  if (saved === "granted" || saved === "denied") {
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: saved,
      });
    }
    hideBanner();
    return;
  }

  showBanner();

  document.addEventListener("click", function (e) {
    const t = e.target;
    if (!t) return;

    if (t.matches("[data-cookie-accept]")) setConsent("granted");
    if (t.matches("[data-cookie-reject]")) setConsent("denied");
  });
})();
