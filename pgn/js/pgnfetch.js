function fetchPgn(filename) {
  document.getElementById('pgn-container').innerHTML = '';

  new PgnViewer({
    boardName: 'pgn',
    pgnFile: filename + '.pgn',
    pieceSet: 'merida',
    pieceSize: pieceSize()
  });

  var intervalId = setInterval(nextMoveByClickingBoard, 200);

  function pieceSize() {
    var width = window.innerWidth || document.body.clientWidth;
    if (width > 400) { return 46; }
    else if (width > 320) { return 35; }
    else if (width > 280) { return 29; }
    return 24;
  }

  function nextMoveByClickingBoard() {
    var board = document.getElementById('pgn-boardBorder');
    if (board) {
      clearInterval(intervalId);
      board.addEventListener('click', function nextMove() {
        document.getElementById('pgn-forward').click();
      });
    }
  }
}

// show a game based on URL fragment identifier (e.g., "#pgn=bdg|game=5")
(function (filesId, gamesId) {
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
    var pgnFiles = document.getElementById(filesId);
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

  function showGame(number) {
    var intervalId;
    var gameNumber = !isNaN(number) ? parseInt(number) - 1 : 0;
    if (gameNumber > 0) {
      intervalId = setInterval(selectGame, 200);
    }

    function selectGame() {
      var gameSelector = document.getElementById(gamesId);
      if (gameSelector) {
        clearInterval(intervalId);
        gameSelector.selectedIndex = gameNumber;
        gameSelector.dispatchEvent(new Event('change'));
      }
    }
  }
})('pgn-files', 'pgn-problemSelector');
