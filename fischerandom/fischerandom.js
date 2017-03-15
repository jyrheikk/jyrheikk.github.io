/**
 * Creates and displays a Fischerandom chess position for White pieces.
 * @author Jyrki Heikkinen 2010-04-22
 */

var CHESS960 = {};

CHESS960.ctrl = {
  showNext: function() {
    var t = new Timer();
    var position = CHESS960.generator.getNext();
    t.stop();

    CHESS960.tester.showTimer(t.total);
    CHESS960.layout.show(position);
  },

  toggle: function() {
    var position = CHESS960.generator.getPosition();
    CHESS960.layout.show(position, true);
  }
};

/**
 * Generates a valid Chess960 position:
 * - 2 bishops on different colors
 * - Queen and 2 knights
 * - King between 2 rooks
 */
CHESS960.generator = {
  getNext: function() {
    var row = new Array(8);

    var i = this._getRandom(3);
    row[2 * i] = "B"; // dark-squared
    i = this._getRandom(3);
    row[2 * i + 1] = "B"; // light-squared

    i = this._getRandom(5);
    this._addPiece("Q", i, row);

    i = this._getRandom(4);
    this._addPiece("N", i, row);
    i = this._getRandom(3);
    this._addPiece("N", i, row);

    this._addPiece("R", 0, row);
    this._addPiece("K", 0, row);
    this._addPiece("R", 0, row);

    this._position = row.join("");
    return this._position;
  },

  getPosition: function() {
    return this._position;
  },

  _addPiece: function(piece, i, row) {
    //console.log(piece + " to " + i + " (" + row.toString() + ")");
    var empty = 0;
    for (var k = 0; k < row.length; k++) {
      if (!row[k]) {
        if (i == empty) {
          row[k] = piece;
          return;
        }
        empty++;
      }
    }
  },

  _randomOrder: function() {
    return this._getRandom(1) - 0.5;
  },

  _getRandom: function(max) {
    return Math.floor(Math.random() * ++max);
  },

  _position: undefined
};

/**
 * Displays the row 1 of a chess diagram.
 * The pieces are either Unicode symbols or images.
 */
CHESS960.layout = {
  /**
   * @param toggle changes layout (optional)
   */
  show: function(position, toggle) {
    if (toggle != undefined && toggle) {
      this._showUnicode = !this._showUnicode;
    }

    document.getElementById("abc").style.display =
      this._showUnicode ? "none" : "block";
    //document.getElementById("fen").innerHTML = position;
    document.getElementById("symbols").innerHTML = this._showUnicode ?
      this._getUnicode(position) : this._getImages(position);
  },

  _getUnicode: function(position) {
    return position.
      replace(/K/g, "&#9812;").
      replace(/Q/g, "&#9813;").
      replace(/R/g, "&#9814;").
      replace(/B/g, "&#9815;").
      replace(/N/g, "&#9816;");
  },

  _getImages: function(position) {
    var html = "";
    for (var i = 0; i < position.length; i++) {
      html += '<img src="' + this._getImageURL(position.charAt(i), i) + '"/>';
    }
    return html;
  },

  _getImageURL: function(piece, pos) {
    var PATH = "w";
    return PATH + piece.toLowerCase() +
      (((pos % 2) == 0) ? "b" : "w") + ".gif";
  },

  showUnicode: false // otherwise images
};

/**
 * Verifies that all the 960 positions are created by Generator.
 */
CHESS960.tester = {
  findAll: function() {
    var COUNT_MAX = 960;
    var MAX_TIME = 30 * 1000;
    var all = [];
    var t = new Timer();
    while (t.total < MAX_TIME && all.length < COUNT_MAX) {
      var position = CHESS960.generator.getNext();
      if (!all.contains(position)) {
        all.push(position);
      }
      t.stop();
      t.start();
    }

    this._debug = true;
    t.stop();
    CHESS960.tester.showTimer(t.total);
    this.showTest("Legal positions: " + all.length);
  },

  setVisibility: function() {
    var id_names = [ "all", "test", "timer" ];
    for (i in id_names) {
      this.toggleVisibility(id_names[i]);
    }
  },

  toggleVisibility: function(id) {
    var element = document.getElementById(id);
    if (element != null) {
      element.style.display = element.style.display == null ||
        element.style.display == "none" ? "inline" : "none";
    }
  },

  showTest: function(str) {
    if (this._debug) {
      document.getElementById("test").innerHTML = str;
    }
  },

  showTimer: function(str) {
    if (this._debug) {
      document.getElementById("timer").innerHTML = "Time: " + str + " ms";
    }
  },

  _debug: false
};

Array.prototype.contains = function(element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) {
      return true;
    }
  }
  return false;
};

CHESS960.ctrl.showNext();
