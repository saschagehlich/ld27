PLATFORM_HEIGHT = 16

class LevelActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game
    @level = @game.getLevel()

  draw: (context) ->
    context.save()

    @drawPlatforms context
    @drawBlocks    context

    context.restore()

  drawPlatforms: (context) ->
    platforms = @level.getPlatforms()
    scroll    = @level.getScroll()

    for platform in platforms
      context.fillStyle = "red"
      context.fillRect(
        platform.position.x - @level.getScroll().x,
        platform.position.y - @level.getScroll().y,
        platform.width, PLATFORM_HEIGHT
      )

  drawBlocks: (context) ->
    scroll   = @level.getScroll()
    blocks   = @level.getBlocks()
    for block in blocks
      @drawBlock block, context

  drawBlock: (block, context) ->
    scroll   = @level.getScroll()
    map      = block.getMap()
    position = block
      .getGridPosition()
      .clone()
      .multiply(@level.GRID_SIZE)
      .substract(scroll)

    for row, y in map
      for segment, x in row
        continue if segment is 0

        context.fillStyle = "blue"
        context.fillRect(
          position.x + x * @level.GRID_SIZE,
          position.y + y * @level.GRID_SIZE,
          @level.GRID_SIZE, @level.GRID_SIZE
        )

    console.log "---"

module.exports = LevelActor
