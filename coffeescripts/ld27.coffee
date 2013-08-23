Game = require "./game.coffee"

window.requestAnimFrame = (->
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          (callback) ->
            window.setTimeout callback, 1000 / 60
  )()

$ ->
  wrapper = $(".canvas-wrapper")

  window.game = new Game(wrapper)
  window.game.run()
