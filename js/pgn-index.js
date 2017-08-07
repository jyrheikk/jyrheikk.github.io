function setGamesTotal (filename) {
  var sum = 0
  $.getJSON(filename, function (data) {
    $.each(data, function (key, value) {
      $("td a[href='" + key + "']").parent().find('td:last-of-type').html(value)
      sum += value
    })
    $("#total").html(sum)
  })
}

$(function addLinks2PgnReader () {
  var url = document.location.origin + '/html/pgn.html#pgn=$filename|title=$title'
  var path = document.baseURI.replace(document.location.origin, '')

  $("#games tr > td:last-of-type").click(function openPgnReader () {
    var pgn = $(this).parent().find('td:first-of-type')
    var link = pgn.find('a')
    if (link) {
      url = url.replace('$filename', path + link.attr('href'))
        .replace('$title', encodeURIComponent(link.text()))
      window.open(url)
    }
  })
})
