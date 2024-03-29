let gameIntervalId = setInterval(waitGameChange, 200);

function fetchPgnUpdateUrl(filename) {
  fetchPgn(filename);
  gameIntervalId = setInterval(waitGameChange, 200);
}

function waitGameChange() {
  const gameSelector = document.getElementById('pgn-problemSelector');
  if (gameSelector) {
    clearInterval(gameIntervalId);
    gameSelector.addEventListener('change', changeGameUrl);
    changeGameUrl();
    changeChessBaseUrl();
  }

  function changeGameUrl() {
    window.history.replaceState(window.history.state, '', `#${getArgs()}`);
  }

  function getArgs() {
    let args = 'pgn=' + getSelectedValue(getPgnName());
    const gameNumber = parseInt(getSelectedValue(gameSelector)) + 1;
    return args + '|game=' + gameNumber;
  }

  function changeChessBaseUrl() {
    const elem = document.getElementById('chessBaseUrl');
    if (elem) {
      const url = getChessBaseUrl();
      elem.innerHTML = `<a href="${url}">ChessBase</a>`;
    }
  }

  function getChessBaseUrl() {
    const pgn = getSelectedValue(getPgnName());
    if (pgn) {
      const title = pgn.replace(/-/g, '%20');
      const pathname = window.location.pathname.replace('pgn.html', pgn);
      return `/pgn/#pgn=${pathname}.pgn|title=${title}`;
    }
  }

  function getSelectedValue(sel) {
    return sel.options[sel.selectedIndex].value;
  }
}
