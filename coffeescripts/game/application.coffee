LD27 = require "./ld27.coffee"

window.requestAnimFrame = (->
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          (callback) ->
            window.setTimeout callback, 1000 / 60
  )()

$ ->
  wrapper = $(".canvas-wrapper")

  game = new LD27(wrapper)
