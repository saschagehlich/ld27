Block = require "./entities/block.coffee"

class Level
  GRID_SIZE: 32
  constructor: (@app, @game) ->
    @scroll = new LDFW.Vector2()
    @gravity = new LDFW.Vector2(0, 1800)
    @platforms = [
      {
        position: new LDFW.Vector2(10, 400)
        width: 300
        height: 16
      }
    ]

    block = new Block(@app, @game)
    block.setGridPosition 5, 10
    @blocks = [ block ]

  update: (delta) ->
    # @scroll.setX @scroll.getX() + delta * 20
    return

  getHorizontalBoundariesForPlayer: (player) ->
    playerX = player.getPosition().getX()
    playerY = player.getPosition().getY()
    playerWidth = 32
    playerHeight = 64

    boundaries =
      min: 0
      max: playerX + @app.getWidth()

    for platform in @platforms
      unless (playerY <= platform.position.y or
        playerY - playerHeight >= platform.position.y + platform.height)
          if playerX + playerWidth <= platform.position.x
            boundaries.max = Math.min(platform.position.x, boundaries.max)
          else if playerX >= platform.position.x + platform.width
            boundaries.min = Math.max(platform.position.x + platform.width, boundaries.min)

    # Check for blocks
    for block in @blocks
      map = block.getMap()
      position = block.getGridPosition()
        .clone()
        .multiply(@GRID_SIZE)

      for row, y in map
        for segment, x in row
          continue if segment is 0

          segmentL = position.getX() + x * @GRID_SIZE
          segmentR = position.getX() + (x + 1) * @GRID_SIZE
          segmentT = position.getY() + y * @GRID_SIZE
          segmentB = position.getY() + (y + 1) * @GRID_SIZE

          unless playerY <= segmentT or playerY - playerHeight >= segmentB
            if playerX + playerWidth <= segmentL
              boundaries.max = Math.min(segmentL, boundaries.max)
            else if playerX >= segmentR
              boundaries.min = Math.max(segmentR, boundaries.min)

    return boundaries

  getHighestPointForPlayer: (player) ->
    maxY = @app.getHeight() * 2

    # Check for platforms
    playerX = player.getPosition().getX()
    playerY = player.getPosition().getY()
    playerWidth = 32

    for platform in @platforms
      continue if playerY > platform.position.y
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
          continue if playerY > position.getY() + y * @GRID_SIZE

          unless (position.getX() + x * @GRID_SIZE >= playerX + playerWidth or
            position.getX() + (x + 1) * @GRID_SIZE <= playerX)
              maxY = Math.min(position.getY() + y * @GRID_SIZE, maxY)

    return maxY

  getScroll: -> @scroll
  getPlatforms: -> @platforms
  getBlocks: -> @blocks
  getGravity: -> @gravity

module.exports = Level
