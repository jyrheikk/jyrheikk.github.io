function completeIndex (baseURI, filename) {
  const pgnPath = baseURI.replace(document.location.origin, '')
  setGamesTotal(pgnPath + filename)
  addLinks2PgnReader()

  function setGamesTotal (fullname) {
    let sum = 0
    $.getJSON(fullname, function (data) {
      $.each(data, function (key, value) {
        $("td a[href='" + key + "']").parent().siblings().last().html(value)
        sum += value
      })
      $('#total').html(sum)
    })
  }

  function addLinks2PgnReader () {
    let urlPath = document.location.origin + '/pgn/#pgn=$filename|title=$title'

    $('#games tr > td:last-of-type').click(function openPgnReader () {
      const link = $(this).parent().find('td:first-of-type a')
      if (link) {
        var url = urlPath.replace('$filename', pgnPath + link.attr('href'))
          .replace('$title', encodeURIComponent(link.text()))
        window.open(url)
      }
    })
  }
}
