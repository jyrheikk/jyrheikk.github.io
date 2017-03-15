/**
 * Creates and displays a Fischerandom chess position for White pieces.
 */

if (!FR) { var FR = {}; }

FR.ctrl = {
  showNext: function() {
    var position = FR.generator.getNext();
    FR.layout.show(position);
  },

  toggle: function() {
    var position = FR.generator.getPosition();
    FR.layout.show(position, true);
  }
};

FR.generator = {
  getNext: function() {
    var row = ['R','N','B','Q','K','B','N','R'];

    while (true) {
      row.sort(this.randomOrder);
      this.position = row.toString().replace(/,/g, '');
      if (this.isValid(this.position)) {
        return this.position;
      }
    }
  },

  getPosition: function() {
    return this.position;
  },

  isValid: function(position) {
    return kingBetweenRooks(position) &&
      bishopsOnDifferentColors(position);

    function kingBetweenRooks() {
      var kingOK = /^.*R.*K.*R.*$/;
      return kingOK.test(position);
    }

    function bishopsOnDifferentColors () {
      var b1 = position.indexOf('B');
      var b2 = position.lastIndexOf('B');
      return ((b2 - b1) % 2) !== 0;
    }
  },

  randomOrder: function() {
    return Math.round(Math.random()) - 0.5;
  },

  position: ''
};

FR.layout = {
  show: function(position, toggle) {
    if (toggle) {
      this.showUnicode = !this.showUnicode;
    }

    document.getElementById('symbols').innerHTML =
      this.showUnicode ? this.getUnicode(position) : position;
  },

  getUnicode: function(position) {
    return position
      .replace(/K/, '&#9812;')
      .replace(/Q/, '&#9813;')
      .replace(/R/g, '&#9814;')
      .replace(/B/g, '&#9815;')
      .replace(/N/g, '&#9816;');
  },

  showUnicode: true // otherwise letters
};

FR.ctrl.showNext();
