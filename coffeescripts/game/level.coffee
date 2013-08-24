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

    # Check for platforms
    playerX = player.getPosition().getX()
    playerWidth = 32
    for platform in @platforms
      unless (platform.position.x > playerX + playerWidth or
        platform.position.x + platform.width < playerX)
          maxY = Math.min(platform.position.y, maxY)

    # Check for blocks
    for block in @blocks
      map = block.getMap()
      position = block.getGridPosition()
        .clone()
        .multiply(@GRID_SIZE)

      for row, y in map
        for segment, x in row
          continue if segment is 0

          unless (position.getX() + x * @GRID_SIZE > playerX + playerWidth or
            position.getX() + (x + 1) * @GRID_SIZE < playerX)
              maxY = Math.min(position.getY() + y * @GRID_SIZE, maxY)

    return maxY

  getScroll: -> @scroll
  getPlatforms: -> @platforms
  getBlocks: -> @blocks
  getGravity: -> @gravity

module.exports = Level
