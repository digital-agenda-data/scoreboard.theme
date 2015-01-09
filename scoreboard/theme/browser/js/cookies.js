$(function add_popup() {
  if (getCookie("_accept_cookies") !== undefined)
    return;

  div = $("<div class='cookie-consent'><h2>Cookies</h2>" +
            "<p>This site uses cookies to offer you a better browsing experience. Find out more on <a href='http://google.ro'>how we use cookies and how you can change cookie settings</a>.</p>" +
          "</div>");

  button_accept = $("<button type='button' class='btn btn-mini btn-primary'>I accept cookies</button>").click(accept_cookie);
  button_deny = $("<button type='button' class='btn btn-mini btn-primary'>I refuse cookies</button>").click(deny_cookie);

  div.append($("<div class='cookie-actions'>").append(button_accept).append(button_deny));
  $("#main").prepend(div);
});

function accept_cookie() {
  setCookie("_accept_cookies", true, 2000);
  $(".cookie-consent").remove();
}

function deny_cookie() {
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);

  setCookie("_accept_cookies", false, 2000);
  $(".cookie-consent").remove();
}

// TODO: use jquery.cookie instead
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2)
    return parts.pop().split(";").shift();
  return undefined;
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
