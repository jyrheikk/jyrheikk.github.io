var domUtil = {
  addLink: function(linkId, linkTitle, clickFunc) {
    var link = document.getElementById(linkId);
    link.style.cursor = 'pointer';
    link.style.color = 'blue';
    link.title = linkTitle;
    link.addEventListener("click", clickFunc);
  },

  addSequenceNumberColumn: function(tableId, columnName) {
    columnName = columnName || '#';
    domUtil.eachCell(tableId, function(cells, row) {
      domUtil.insertCell(cells, row, 'th', columnName);
    }, 'th');

    var counter = 1;
    domUtil.eachCell(tableId, function(cells, row) {
      domUtil.insertCell(cells, row, 'td', counter++);
    });
  },

  eachCell: function(tableId, cellHandler, cellTag) {
    cellTag = cellTag || 'td';
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName(cellTag);
      if (cells.length > 0) {
        cellHandler(cells, rows[i], i);
      }
    }
  },

  insertCell: function(cells, row, cellTag, value) {
    var counterCell = document.createElement(cellTag);
    var node = document.createTextNode(value);
    counterCell.appendChild(node);
    row.insertBefore(counterCell, cells[0]);
  },

  countColumnClasses: function(words, tableId, cellIndex) {
    domUtil.eachCell(tableId, function(cells, row, lineNumber) {
      if (cells.length > cellIndex) {
        addClassName(cells[cellIndex], lineNumber);
      }
    });

    function addClassName(cell, lineNumber) {
      var className = cell.className || 'misc';
      domUtil.addWordCount(words, className, lineNumber);
    }
  },

  countColumnWords: function(words, tableId, cellIndex) {
    domUtil.eachCell(tableId, function(cells, row, lineNumber) {
      if (cells.length > cellIndex) {
        addWords(cells[cellIndex].textContent, lineNumber);
      }
    });

    function addWords(csv, lineNumber) {
      var parsedWords = csv.split(',');
      for (var i = 0; i < parsedWords.length; i++) {
        var oneWord = parsedWords[i].trim();
        domUtil.addWordCount(words, oneWord, lineNumber);
      }
    }
  },

  addWordCount: function(words, oneWord, weightIndex) {
    for (var i = 0; i < words.length; i++) {
      if (words[i][0] === oneWord) {
        words[i][1]++;
        words[i][2] += this.getWeight(weightIndex);
        return;
      }
    }

    words.push([ oneWord, 1, this.getWeight(weightIndex) ]);
  },

  getWeight: function(weightIndex) {
    return this.weight && weightIndex ? this.weight[weightIndex] : 0;
  },

  setWeight: function(weight) {
    this.weight = weight;
  },

  weight: undefined
};

var mainTable = {
  id: 'projects',
  allEfforts: [ 0 ], // ignore the 1st row (th tag)
  columns: {
    projects: {
      id: 'description',
      title: 'Number of tasks and man-days in projects',
      position: 1
    },
    technologies: {
      id: 'technologies',
      title: 'Number of projects and man-days per technologies used',
      position: 2
    },
    effort: {
      id: 'effort',
      title: 'Number of projects per work effort',
      longValues: [ 'Small', 'Medium', 'Large', 'UNKNOWN' ],
      effortInDays: [ 3, 15, 50, 1 ],
      position: 3,

      getValue: function(value, arr) {
        var allValues = [ 'S', 'M', 'L' ];
        var i = allValues.indexOf(value);
        if (i === -1) {
          i = arr.length - 1;
        }
        return arr[i];
      }
    },
    year: {
      id: 'year',
      title: 'Number of projects and man-days per year',
      position: 4
    },
  },

  getMessage: function(word, minEffort) {
	  minEffort = minEffort || 0;
	  var effort = word[2] > minEffort ? ', MD ' + word[2] : '';

    return word[0] + ' (' + word[1] + effort + ')';
  }
};

domUtil.addSequenceNumberColumn(mainTable.id);

(function reportWorkEffort(table, column, allEfforts) {
  var words = [];
  var totalEffort = 0;

  domUtil.eachCell(table.id, function(cells) {
    var effortSize = cells[column.position].textContent;
    var effort = column.getValue(effortSize, column.effortInDays);
    totalEffort += effort;
    allEfforts.push(effort);
  });

  domUtil.countColumnWords(words, table.id, column.position);

  words.sort(function(a, b) {
    return b[1] - a[1];
  });

  domUtil.addLink(column.id, column.title, function() {
    var message = column.title + ':\n\n';

    words.forEach(function(word) {
      message += column.getValue(word[0], column.longValues) +
        ' ' + word[1] + ' (' + getPercentage(word[1]) + ' %)\n';
    });

    message += '\nTotal work effort: ' + totalEffort + ' days';
    alert(message);
  });

  function getPercentage(nr) {
    return Math.round(nr * 100 / (allEfforts.length - 1));
  }
})(mainTable, mainTable.columns.effort, mainTable.allEfforts);

domUtil.setWeight(mainTable.allEfforts);

(function reportProjects(table, column) {
  var words = [];
  domUtil.countColumnClasses(words, table.id, column.position);

  domUtil.addLink(column.id, column.title, function() {
    var message = column.title + ':\n\n';

    words.forEach(function(word, index) {
      message += table.getMessage(word) + '\n';
    });
    alert(message);
  });
})(mainTable, mainTable.columns.projects);

(function reportTechnologies(table, column) {
  var words = [];
  domUtil.countColumnWords(words, table.id, column.position);

  words.sort(function(a, b) {
    var result = b[1] - a[1];
    if (result === 0) {
      result = a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1;
    }
    return result;
  });

  domUtil.addLink(column.id, column.title, function() {
    var message = column.title + ':\n';
    var prev = 0;

    words.forEach(function(word, index) {
      message += getDelimiter() + ' ' + getMessage();
      prev = word[1];

      function getDelimiter() {
        return prev !== word[1] ? '\n' + (index + 1) : ', ';
      }

      function getMessage() {
      	var minEffort = 40;
        return prev !== word[1] || word[2] > minEffort ?
          table.getMessage(word, minEffort) :
          word[0];
      }
    });

    message += '\n\nTotal number of technologies: ' + words.length;
    alert(message);
  });
})(mainTable, mainTable.columns.technologies);

(function reportYear(table, column) {
  var words = [];
  domUtil.countColumnWords(words, table.id, column.position);

  domUtil.addLink(column.id, column.title, function() {
    var message = column.title + ':\n\n';

    words.forEach(function(word, index) {
      message += table.getMessage(word) + '\n';
    });
    alert(message);
  });
})(mainTable, mainTable.columns.year);
