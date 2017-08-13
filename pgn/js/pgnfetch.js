var ids = {
  files: 'pgn-files',
  games: 'pgn-problemSelector',
  container: 'pgn-container',
  board: 'pgn-boardBorder',
  buttons: 'pgn-navButtons',
  start: 'pgn-start',
  forward: 'pgn-forward',
  end: 'pgn-end'
};

var waitInterval = 200;

var pgnStatus = {
  prev: false,
  next: false
};

function fetchPgn(filename) {
  document.getElementById(ids.container).innerHTML = '';

  new PgnViewer({
    boardName: 'pgn',
    pgnFile: filename + '.pgn',
    pieceSet: 'merida',
    pieceSize: pieceSize()
  });

  function pieceSize() {
    var width = window.innerWidth || document.body.clientWidth;
    if (width > 400) { return 46; }
    else if (width > 320) { return 35; }
    else if (width > 280) { return 29; }
    return 24;
  }

  var boardIntervalId = setInterval(nextMoveByClickingBoard, waitInterval);

  function nextMoveByClickingBoard() {
    var board = document.getElementById(ids.board);
    if (board) {
      clearInterval(boardIntervalId);
      board.addEventListener('click', function nextMove() {
        document.getElementById(ids.forward).click();
      });
      var buttonsIntervalId = setInterval(enablePrevNextGame, waitInterval);
    }

    function enablePrevNextGame() {
      var buttonsSelector = document.getElementById(ids.buttons);
      if (buttonsSelector) {
        clearInterval(buttonsIntervalId);
        addGameEvents();
      }
    }
  }

  function addGameEvents() {
    document.getElementById(ids.start).addEventListener('click', function() {
      if (pgnStatus.prev) {
        incrementGame(-1);
      }
      pgnStatus.prev = !pgnStatus.prev;
    });
  
    document.getElementById(ids.end).addEventListener('click', function() {
      if (pgnStatus.next) {
        incrementGame(1);
      }
      pgnStatus.next = !pgnStatus.next;
    });
  
    function incrementGame(incr) {
      var item = document.getElementById(ids.games);
      var newIndex = item.selectedIndex + incr;
      if (newIndex > -1 && newIndex < item.length) {
        showGame(newIndex + 1);
      }
    }
  }
}

function showGame(number) {
  var gameNumber = !isNaN(number) ? parseInt(number) - 1 : 0;
  var gameIntervalId = setInterval(selectGame, waitInterval);

  function selectGame() {
    var gameSelector = document.getElementById(ids.games);
    if (gameSelector) {
      clearInterval(gameIntervalId);
      gameSelector.selectedIndex = gameNumber;
      gameSelector.dispatchEvent(new Event('change'));
    }
  }
}

// show a game based on URL fragment identifier (e.g., "#pgn=bdg|game=5")
(function () {
  var params = parseUrlParams();
  selectPgn(params.pgn);
  showGame(params.game);

  function parseUrlParams() {
    var paramsObj = {};
    var delim = window.location.hash.indexOf('|') > -1 ? '|' : '%7C';
    var urlParams = window.location.hash.substr(1).split(delim);
    urlParams.forEach(function (value) {
      var arg = value.split('=');
      paramsObj[arg[0]] = arg[1];
    });
    return paramsObj;
  }

  function selectPgn(filename) {
    var pgnFiles = document.getElementById(ids.files);
    var pgnName = filename || pgnFiles.options[0].value;

    fetchPgn(pgnName);
    if (filename) {
      changeSelectedByValue(pgnFiles, filename);
    }

    function changeSelectedByValue(selection, value) {
      for (var i = 0; selection.options[i]; i++) {
        if (selection.options[i].value === value) {
          selection.selectedIndex = i;
          break;
        }
      }
    }
  }
})();
