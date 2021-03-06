var attachEvent = document.attachEvent
var once = require('once')
var raf = require('raf')

var cancelFrame = (function(){
  var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
          window.clearTimeout
  return function(id){ return cancel(id); }
})()

function resizeListener(e){
  var win = e.target || e.srcElement
  if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__)
  win.__resizeRAF__ = raf(function(){
    var trigger = win.__resizeTrigger__
    trigger.__resizeListeners__.forEach(function(fn){
      fn.call(trigger, e)
    })
  })
}

function objectLoad(e){
  this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__
  this.contentDocument.defaultView.addEventListener('resize', resizeListener)
}

function removeListener (element, fn) {
  var trigger = element.__resizeTrigger__
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
  if (!element.__resizeListeners__.length) {
    if (attachEvent) element.detachEvent('onresize', resizeListener)
    else if (trigger.contentDocument) {
      trigger.contentDocument.defaultView.removeEventListener('resize', resizeListener)
      element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
    }
  }
}
module.exports = function(element, fn){
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    if (attachEvent) {
      element.__resizeTrigger__ = element
      element.attachEvent('onresize', resizeListener)
    }
    else {
      if (getComputedStyle(element).position == 'static') element.style.position = 'relative'
      var obj = element.__resizeTrigger__ = document.createElement('object');
      obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
      obj.__resizeElement__ = element
      obj.onload = objectLoad
      obj.type = 'text/html'
      obj.data = 'about:blank'
      element.appendChild(obj)
    }
  }
  element.__resizeListeners__.push(fn)
  return once(removeListener.bind(null, element, fn))
}
