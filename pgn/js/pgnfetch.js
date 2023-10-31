const ids = {
  files: 'pgn-files',
  games: 'pgn-problemSelector',
  container: 'pgn-container',
  board: 'pgn-boardBorder',
  buttons: 'pgn-navButtons',
  start: 'pgn-start',
  forward: 'pgn-forward',
  end: 'pgn-end',
  moves: 'pgn-moves'
};

const waitInterval = 200;

const pgnStatus = {
  prev: false,
  next: false
};

function fetchPgn(filename) {
  const boardIntervalId = setInterval(nextMoveByClickingBoard, waitInterval);
  let buttonsIntervalId;

  document.getElementById(ids.container).innerHTML = '';

  new PgnViewer({
    boardName: 'pgn',
    pgnFile: filename + '.pgn',
    pieceSet: 'merida',
    pieceSize: pieceSize()
  });

  function pieceSize() {
    const width = window.innerWidth || document.body.clientWidth;
    if (width > 400) { return 46; }
    else if (width > 320) { return 35; }
    else if (width > 280) { return 29; }
    return 24;
  }

  function nextMoveByClickingBoard() {
    const board = document.getElementById(ids.board);
    if (board) {
      clearInterval(boardIntervalId);
      board.addEventListener('click', () => {
        document.getElementById(ids.forward).click();
      });
      buttonsIntervalId = setInterval(enablePrevNextGame, waitInterval);
    }

    function enablePrevNextGame() {
      const buttonsSelector = document.getElementById(ids.buttons);
      if (buttonsSelector && buttonsIntervalId) {
        clearInterval(buttonsIntervalId);
        addGameEvents();
      }
    }
  }

  function addGameEvents() {
    document.getElementById(ids.start).addEventListener('click', () => {
      if (pgnStatus.prev) {
        incrementGame(-1);
      }
      pgnStatus.prev = !pgnStatus.prev;
    });
  
    document.getElementById(ids.end).addEventListener('click', () => {
      if (pgnStatus.next) {
        incrementGame(1);
      }
      pgnStatus.next = !pgnStatus.next;
    });
  
    function incrementGame(incr) {
      const item = document.getElementById(ids.games);
      const newIndex = item.selectedIndex + incr;
      if (newIndex > -1 && newIndex < item.length) {
        showGame(newIndex + 1);
      }
    }
  }
}

function showGame(number) {
  const gameNumber = !isNaN(number) ? parseInt(number) - 1 : 0;
  const gameIntervalId = setInterval(selectGame, waitInterval);

  function selectGame() {
    const gameSelector = document.getElementById(ids.games);
    if (gameSelector) {
      clearInterval(gameIntervalId);
      gameSelector.selectedIndex = gameNumber;
      gameSelector.dispatchEvent(new Event('change'));
    }
  }
}

function parseUrlParams() {
  const paramsObj = {};
  const delim = window.location.hash.indexOf('|') > -1 ? '|' : '%7C';
  const urlParams = window.location.hash.substr(1).split(delim);
  urlParams.map(value => value.split('=')).forEach(([key, value]) => {
    paramsObj[key] = value;
  });
  return paramsObj;
}

function selectPgn(filename) {
  const pgnFiles = document.getElementById(ids.files);
  const pgnName = filename || pgnFiles.options[0].value;

  fetchPgn(pgnName);
  if (filename) {
    changeSelectedByValue(pgnFiles, filename);
  }

  function changeSelectedByValue(selection, value) {
    for (let i = 0; selection.options[i]; i++) {
      if (selection.options[i].value === value) {
        selection.selectedIndex = i;
        break;
      }
    }
  }
}

function getPgnName() {
  return document.getElementById(ids.files);
}

// show a game based on URL fragment identifier (e.g., "#pgn=bdg|game=5")
(function () {
  const { pgn, game } = parseUrlParams();
  selectPgn(pgn);
  showGame(game);
})();

function copyToClipboard() {
  navigator.clipboard.writeText(getGameMoves());
}

function openLichessAnalysis() {
  const moves = getGameMoves().replace(/([18])=([QRBN])/g, '$1$2');
  const params = encodeURIComponent(moves).replace(/%20/g, '+');
  const url = `https://lichess.org/analysis/pgn/${params}`;
  window.open(url, '_blank');
}

const htmlTagPattern = /<[^>]*>/g;
const spacePattern = /&nbsp;/g;

function getGameMoves() {
  return document.getElementById(ids.moves).innerHTML
    .replace(htmlTagPattern, '')
    .replace(spacePattern, ' ')
    .trim();
}
