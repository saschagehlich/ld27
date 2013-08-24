Block = require "./entities/block.coffee"

class Level
  GRID_SIZE: 32
  constructor: (@app, @game) ->
    @scroll = new LDFW.Vector2()
    @gravity = new LDFW.Vector2(0, 1000)
    @platforms = [
      {
        position: new LDFW.Vector2(10, 400)
        width: 300
      }
    ]

    block = new Block(@app, @game)
    block.setGridPosition 10, 7
    @blocks = [ block ]

  update: (delta) ->
    # @scroll.setX @scroll.getX() + delta * 20
    return

  getHighestPointForPlayer: (player) ->
    maxY = @app.getHeight() * 2

    x = player.getPosition().getX()
    w = 32
    for platform in @platforms
      unless (platform.position.x > x + w or
        platform.position.x + platform.width < x)
          maxY = platform.position.y

    return maxY

  getScroll: -> @scroll
  getPlatforms: -> @platforms
  getBlocks: -> @blocks
  getGravity: -> @gravity

module.exports = Level
