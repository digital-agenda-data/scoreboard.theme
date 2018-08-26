$(function add_popup() {
  var _accept = readCookie("_accept_cookies");
  if (_accept !== undefined && _accept != null)
    return;

  div = $("<div class='cookie-consent'><p>This site uses cookies for anonymous web statistics. <a href='" +
     portal_url + "/privacy'>Find out more on how we use cookies and how you can opt-out</a>.</p></div>");

  button_accept = $("<button type='button' class='btn btn-xs btn-success'>I accept</button>").click(accept_cookie);
  button_deny = $("<button type='button' class='btn btn-xs btn-danger'>I refuse cookies</button>").click(deny_cookie);

  div.find('p').append(button_accept).append(button_deny);
  $("body").prepend(div);
});

function accept_cookie() {
  createCookie("_accept_cookies", true, 365);
  $(".cookie-consent").remove();
}

function deny_cookie() {
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);

  createCookie("_accept_cookies", false, 365);
  $(".cookie-consent").remove();
}

