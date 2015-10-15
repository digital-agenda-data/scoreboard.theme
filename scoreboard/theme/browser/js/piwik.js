var _paq = _paq || [];
// Check for cookie consent
if (readCookie("_accept_cookies") === "false") {
  _paq.push(['disableCookies']);
}
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u=(("https:" == document.location.protocol) ? "https" : "http") + "://test.digital-agenda-data.eu/analytics/piwik/";
  _paq.push(['setTrackerUrl', u+'piwik.php']);
  _paq.push(['setSiteId', 1]);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
  g.defer=true; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
})();
