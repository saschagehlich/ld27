Level    = require "./level.coffee"
Player   = require "./player.coffee"
Keyboard = require "./utilities/keyboard.coffee"
Mouse    = require "./utilities/mouse.coffee"

class Game
  constructor: (@app) ->
    @keyboard = new Keyboard()
    @mouse    = new Mouse @app

    @level = new Level @app, this
    @player = new Player @app, this

    firstPlatform = @level.getPlatforms()[0]
    @player.setPosition(
      firstPlatform.position.x,
      firstPlatform.position.y - 100
    )

  update: (delta) ->
    @level.update delta
    @player.update delta

  getLevel: -> @level
  getPlayer: -> @player
  getKeyboard: -> @keyboard
  getMouse: -> @mouse

module.exports = Game
