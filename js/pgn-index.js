function completeIndex (path, filename) {
  setGamesTotal(path + filename)
  addLinks2PgnReader()

  function setGamesTotal (fullname) {
    var sum = 0
    $.getJSON(fullname, function (data) {
      $.each(data, function (key, value) {
        $("td a[href='" + key + "']").parent().siblings().last().html(value)
        sum += value
      })
      $("#total").html(sum)
    })
  }

  function addLinks2PgnReader () {
    var url = document.location.origin + '/html/pgn.html#pgn=$filename|title=$title'

    $('#games tr > td:last-of-type').click(function openPgnReader () {
      var link = $(this).parent().find('td:first-of-type a')
      if (link) {
        url = url.replace('$filename', path + link.attr('href'))
          .replace('$title', encodeURIComponent(link.text()))
        window.open(url)
      }
    })
  }
}
