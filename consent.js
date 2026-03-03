(function () {
  const KEY = "cookie_consent_v1";
  const GA_ID = "G-FV6Q6EKYZ1";

  function hideBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "none";
  }

  function showBanner() {
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "block";
  }

  // Create a safe gtag stub (won't load GA by itself)
  function ensureGtagStub() {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
  }

  // Default: deny until user accepts
  function setDefaultConsentDenied() {
    ensureGtagStub();
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      wait_for_update: 500,
    });
  }

  function loadGoogleAnalytics() {
    // prevent double-loading
    if (document.getElementById("ga-gtag")) return;

    ensureGtagStub();

    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    s.id = "ga-gtag";
    document.head.appendChild(s);

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  function setConsent(value) {
    localStorage.setItem(KEY, value);

    ensureGtagStub();
    window.gtag("consent", "update", {
      analytics_storage: value,
    });

    if (value === "granted") {
      loadGoogleAnalytics();
    }

    hideBanner();
  }

  // Always start with denied until proven otherwise
  setDefaultConsentDenied();

  const saved = localStorage.getItem(KEY);

  if (saved === "granted") {
    // user already accepted earlier
    ensureGtagStub();
    window.gtag("consent", "update", { analytics_storage: "granted" });
    loadGoogleAnalytics();
    hideBanner();
    return;
  }

  if (saved === "denied") {
    // user already denied earlier
    ensureGtagStub();
    window.gtag("consent", "update", { analytics_storage: "denied" });
    hideBanner();
    return;
  }

  // No choice yet → show banner
  showBanner();

  document.addEventListener("click", function (e) {
    const t = e.target;
    if (!t) return;

    if (t.matches("[data-cookie-accept]")) setConsent("granted");
    if (t.matches("[data-cookie-reject]")) setConsent("denied");
  });
})();
