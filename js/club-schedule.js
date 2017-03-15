/**
 * Club Calendar, lists clubs alphabetically, by date/time or city
 */

var CAL = {};

$(function() {
  CAL.data.parse();

  var DEFAULT_FILTER = CAL.dom.id.showMainCities;
  var DEFAULT_SORTER = CAL.dom.id.sortByDay;
  CAL.sorter.filter(DEFAULT_FILTER, DEFAULT_SORTER);
  CAL.options.add();
});

CAL.data = {
  parse: function() {
    this._parseClubs();
    this._parseCities();
  },

  getCities: function() {
    return this._cities;
  },

  getMainCityClubTotal: function() {
    return this._mainCityTotal;
  },

  getClubs: function() {
    return this._clubs;
  },

  getClubTotal: function() {
    return this._clubs.length;
  },

  _parseClubs: function() {
    var that = this;
    $("." + CAL.dom.className.club).each(function() {
      var club = new CAL.Club();
      var dom = $(this);

      $.each(CAL.Club.sortFields, function(name, field) {
        that._updateField(dom, club, field, CAL.dom.className[field]);
      });

      club.html = dom.html();
      that._clubs.push(club);
    });
  },

  _updateField: function(dom, club, field, className) {
    dom.find("." + className).each(function() {
      club[field].push($(this).text());
    });
  },

  _parseCities: function() {
    var that = this;
    $.each(CAL.data.getClubs(), function(i, club) {
      if (club.isInMainCity()) {
        that._mainCityTotal++;
      }
      if ($.inArray(club.cities[0], that._cities) === -1) {
        that._cities.push(club.cities[0]);
      }
    });
    that._cities.sort();
  },

  _clubs: [],
  _cities: [],
  _mainCityTotal: 0
};

CAL.sorter = {
  filter: function(filterID, sortID) {
    this._filter = filterID;
    this.sort(sortID);
  },

  sort: function(id) {
    this._sortOrder = id || this._sortOrder;
    this[this._sortOrder]();
  },

  sortByCity: function() {
    this._sortBy(CAL.data.getCities(), CAL.Club.sortFields.cities);
    this._highlight("." + CAL.dom.className.address);
  },

  sortByClub: function() {
    var DUMMY_CATEGORIES = [ false ];
    this._sortBy(DUMMY_CATEGORIES);
    //this._highlight("." + CAL.dom.className.name);
  },

  sortByDay: function() {
    this._sortBy(CAL.ui.days, CAL.Club.sortFields.days, this._sortByTime);
    this._highlight("." + CAL.dom.className.times);
  },

  getOrder: function() {
    return this._sortOrder;
  },

  getFilter: function() {
    return this._filter;
  },

  _sortByTime: function(a, b) {
    //return CAL.sorter._sorter(a.times[0], b.times[0]);
    return CAL.sorter._sorter(CAL.sorter._minTime(a), CAL.sorter._minTime(b));
  },

  _minTime: function(a) {
    return a.times.length === 1 ? a.times[0] :
      (a.times[0] < a.times[1] ? a.times[0] : a.times[1]);
  },

  _sorter: function(x, y) {
    return x == y ? 0 : (x < y ? -1 : 1);
  },

  _sortBy: function(allCategories, sortField, sortFunc) {
    var that = this;
    var html = "";
    $.each(allCategories, function(i, category) {
      var found = [];
      $.each(CAL.data.getClubs(), function(k, club) {
        if ((!category || $.inArray(category, club[sortField]) > -1) &&
          that._matches(club))
        {
          found.push(club);
        }
      });

      html += that._addCategory(category, found, sortFunc);
    });
    $("#" + CAL.dom.id.content).html(html);
  },

  _addCategory: function(category, found, sortFunc) {
    var html = "";
    if (found.length > 0) {
      if (category) {
        html += "<h3>" + category.capitalize() + "</h3>";
      }
      if (sortFunc) {
        found.sort(sortFunc);
      }
      $.each(found, function(i, club) {
        html += club.toHTML();
      });
    }
    return html;
  },

  _highlight: function(el) {
    $("#" + CAL.dom.id.content).find(el).addClass(CAL.dom.className.highlight);
  },

  _matches: function(club) {
    return this._filter === CAL.dom.id.showAllCities ||
      (this._filter === CAL.dom.id.showMainCities && club.isInMainCity());
  },

  _sortOrder: "",
  _filter: "",

  FILTER_FUNC: "filter",
  SORT_FUNC: "sort"
};

CAL.options = {
  add: function() {
    this._addFilter();
    this._addSorter();
  },

  _addFilter: function() {
    this._disableLink(CAL.sorter.getFilter());
    this._addHelpText(CAL.dom.id.showMainCities,
                      CAL.data.getMainCityClubTotal());
    this._addHelpText(CAL.dom.id.showAllCities, CAL.data.getClubTotal());
    this._addEvents(CAL.dom.id.showOptions, CAL.sorter.FILTER_FUNC);
  },

  _addSorter: function() {
    this._disableLink(CAL.sorter.getOrder());
    this._addEvents(CAL.dom.id.sortOptions, CAL.sorter.SORT_FUNC);
  },

  _addHelpText: function(id, total) {
    var help = total + " " + CAL.ui.help.clubs;
    $("#" + id).attr("title", help);
  },

  _addEvents: function(parentID, sorterFunc) {
    var that = this;
    $("#" + parentID).find("a").bind("click", function(event) {
      var id = that._getEventID(event);
      $(this).parent().find("a").addClass(CAL.dom.className.enabledLink).
        removeClass(CAL.dom.className.disabledLink);
      that._disableLink(id);
      CAL.sorter[sorterFunc](id);
      return false;
    });
  },

  _getEventID: function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    return target.id;
  },

  _disableLink: function(id) {
    $("#" + id).addClass(CAL.dom.className.disabledLink).
      removeClass(CAL.dom.className.enabledLink);
  }
};

CAL.Club = function() {
  this.name = "";
  this.days = [];
  this.times = [];
  this.address = "";
  this.cities = [];
  this.info = "";
  this.html = "";

  CAL.Club.sortFields = {
    days: "days",
    times: "times",
    cities: "cities"
  };
};

CAL.Club.prototype.isInMainCity = function() {
  return $.inArray(this.cities[0], CAL.ui.mainCities) > -1;
};

CAL.Club.prototype.toHTML = function() {
  return '<div class="' + CAL.dom.className.club + '">' + this.html + '</div>';
};

CAL.dom = {
  className: {
    club: "club",
    name: "name",
    days: "day",
    times: "time",
    address: "address",
    cities: "city",
    notes: "notes",

    disabledLink: "disabledLink",
    enabledLink: "enabledLink",
    highlight: "highlight"
  },

  id: {
    content: "content",
    showOptions: "showOptions",
    showAllCities: "showAllCities",
    showMainCities: "showMainCities",
    sortOptions: "sortOptions",
    sortByCity: "sortByCity",
    sortByClub: "sortByClub",
    sortByDay: "sortByDay"
  }
};

CAL.ui = {
  days: [
    "maanantai",
    "tiistai",
    "keskiviikko",
    "torstai",
    "perjantai",
    "lauantai",
    "sunnuntai"
  ],

  mainCities: [
    "Espoo",
    "Helsinki",
    "Vantaa"
  ],

  help: {
    clubs: "kerhoa"
  }
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
