// Piwik is currently loaded through js code from plone.
// In order to have the cookie consent properly working, use this instead.
$q = _paq || [];
if (getCookie("_accept_cookies") === "false") {
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

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2)
    return parts.pop().split(";").shift();
  return undefined;
}(".cookie-consent").remove();
