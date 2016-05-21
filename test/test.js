/*global describe, it, beforeEach, afterEach*/
var assert = require('assert')
var resize = require('..')

var el
beforeEach(function () {
  el = document.createElement('div')
  el.textContent = 'tobi'
  document.body.appendChild(el)
})

afterEach(function () {
  document.body.removeChild(el)
})

describe('Onresize', function() {
  it('should listen to element resize', function (done) {
    var count = 0
    resize(el, function (e) {
      count ++ 
      assert.equal(count, 1)
      done()
    })
    setTimeout(function () {
      el.style.height = '200px'
    }, 300)
  })

  it('should unbind resize listener', function (done) {
    var count = 0
    var unbind = resize(el, function (e) {
      count ++ 
      assert.equal(count, 1)
    })
    setTimeout(function () {
      el.style.height = '200px'
      setTimeout(function () {
        unbind()
        setTimeout(function () {
          el.style.height = '10px'
        }, 30)
      }, 200)
    }, 300)
    setTimeout(done, 700)
  })
})
