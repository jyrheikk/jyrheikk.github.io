var gameIntervalId = setInterval(waitGameChange, 200);

function fetchPgnUpdateUrl(filename) {
  fetchPgn(filename);
  gameIntervalId = setInterval(waitGameChange, 200);
}

function waitGameChange() {
  var gameSelector = document.getElementById('pgn-problemSelector');
  if (gameSelector) {
    clearInterval(gameIntervalId);
    gameSelector.addEventListener('change', changeShortUrl);
    changeShortUrl();
  }

  function changeShortUrl() {
    var url = getShortUrl();
    document.getElementById('shortUrl').innerHTML =
      '<a href="' + url + '">' + url + '</a>';
  }

  function getShortUrl() {
    return window.location.href + '#' + getArgs();
  }

  function getArgs() {
    var args = 'pgn=' + getSelectedValue(document.getElementById('pgn-files'));
    var gameNumber = getSelectedValue(gameSelector);
    args += '|game=' + (parseInt(gameNumber) + 1);
    return args;
  }

  function getSelectedValue(sel) {
    return sel.options[sel.selectedIndex].value;
  }
}
