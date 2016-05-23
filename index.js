var el = document.getElementById('demo')
var resize = require('..')

var unbind = resize(el, function (e) {
  console.log(e)
})

document.getElementById('unbind').addEventListener('click', function () {
  unbind()
})
