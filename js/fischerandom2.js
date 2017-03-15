/**
 * Creates and displays a Fischerandom chess position for White pieces.
 */

if (!CHESS960) { var CHESS960 = {}; }

CHESS960.ctrl = function() {
  return {
    showNext: function() {
      var position = CHESS960.generator.getNext();
      CHESS960.layout.show(position);
    },

    toggle: function() {
      var position = CHESS960.generator.getPosition();
      CHESS960.layout.show(position, true);
    }
  };
}();

CHESS960.generator = function() {
  var position = undefined;

  var isValid = function(position) {
    return isKingBetweenRooks(position) &&
      areBishopsOnDifferentColors(position);
  };

  var isKingBetweenRooks = function(position) {
    var kingOK = /^.*R.*K.*R.*$/;
    return kingOK.test(position);
  };

  var areBishopsOnDifferentColors = function(position) {
    var b1 = position.indexOf("B");
    var b2 = position.lastIndexOf("B");
    return ((b2 - b1) % 2) != 0;
  };

  var randomOrder = function() {
    return Math.round(Math.random()) - 0.5;
  };

  return {
    getNext: function() {
      var row = ["R","N","B","Q","K","B","N","R"];

      while (true) {
        row.sort(randomOrder);
        position = row.toString().replace(/,/g, "");
        if (isValid(position)) {
          return position;
        }
      }
    },

    getPosition: function() {
      return position;
    }
  };
}();

CHESS960.layout = function() {
  var showUnicode = true; // otherwise letters

  var getUnicode = function(position) {
    return position
      .replace(/K/, "&#9812;")
      .replace(/Q/, "&#9813;")
      .replace(/R/g, "&#9814;")
      .replace(/B/g, "&#9815;")
      .replace(/N/g, "&#9816;");
  };

  return {
    show: function(position, toggle) {
      if (toggle) {
        showUnicode = !showUnicode;
      }

      document.getElementById("symbols").innerHTML =
        showUnicode ? getUnicode(position) : position;
    }
  };
}();

CHESS960.ctrl.showNext();
