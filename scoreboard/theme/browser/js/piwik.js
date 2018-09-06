pwk = function(event) {
  (function() {
    //_paq.push(['setTrackerUrl', u+'piwik.php']);
    //_paq.push(['setSiteId', _piwikSiteId]);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
    g.onload = function() {
      try {
          // siteId: 1=test.digital-agenda-data.eu, 2=digital-agenda-data.eu
          var piwikTracker = Piwik.getTracker(_piwik_url + 'piwik.php', _piwikSiteId);
          // Check for cookie consent
          if (readCookie("_accept_cookies") !== "true") {
            piwikTracker.disableCookies();
          }
          var docsTable = document.querySelector(".docsTable");
          if (docsTable) {
            var searchCount = document.querySelector(".docsTable").getAttribute('data-search-result-count');
            piwikTracker.setCustomUrl(document.URL + '&search_count=' + searchCount);
          }
          piwikTracker.trackPageView();
          piwikTracker.enableLinkTracking();
      } catch( err ) {}
    };
    g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
};
if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', pwk);
} else if (document.attachEvent) {
    window.onload = pwk;  // IE8
}