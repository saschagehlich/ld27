Level    = require "./level.coffee"
Player   = require "./player.coffee"
Keyboard = require "./utilities/keyboard.coffee"
Mouse    = require "./utilities/mouse.coffee"
Powerups = require "./powerups.coffee"

class Game
  powerupDuration: 10000
  constructor: (@app) ->
    @keyboard = new Keyboard()
    @mouse    = new Mouse @app

    @level = new Level @app, this
    @player = new Player @app, this

    @activePowerup = Powerups.BROKEN_BLOCKS
    @powerupStart  = +new Date()

    firstPlatform = @level.getPlatforms()[0]
    @player.setPosition(
      firstPlatform.getPosition().x * @level.GRID_SIZE + firstPlatform.getWidth() * @level.GRID_SIZE / 2,
      firstPlatform.getPosition().y * @level.GRID_SIZE - 100
    )

  update: (delta) ->
    @level.update delta
    @player.update delta

    if +new Date() - @powerupStart >= @powerupDuration
      @activePowerup = @getRandomPowerup()
      @powerupStart = +new Date()

  getRandomPowerup: ->
    powerups = Object.keys(Powerups)
    powerupKey = powerups[Math.floor(Math.random() * powerups.length)]
    return Powerups[powerupKey]

  getPowerupTimeleft: -> @powerupDuration - (+new Date() - @powerupStart)
  getActivePowerup: -> @activePowerup

  getLevel: -> @level
  getPlayer: -> @player
  getKeyboard: -> @keyboard
  getMouse: -> @mouse

module.exports = Game
