class LevelActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game
    @level = @game.getLevel()

  draw: (context) ->
    context.save()

    @drawPlatforms  context
    @drawBlocks     context
    @drawBuildBlock context

    context.restore()

  drawPlatforms: (context) ->
    platforms = @level.getPlatforms()
    scroll    = @level.getScroll()

    for platform in platforms
      context.fillStyle = "red"
      context.fillRect(
        platform.position.x - @level.getScroll().x,
        platform.position.y - @level.getScroll().y,
        platform.width, platform.height
      )

  drawBuildBlock: (context) ->
    return unless @level.inBuildMode()

    scroll   = @level.getScroll()
    blocks   = @level.getBlocks()
    @drawBlock @level.getBuildBlock(), context

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

        if block.inBuildMode()
          context.fillStyle = "rgba(0, 0, 255, 0.5)"
        else
          context.fillStyle = "blue"

        context.fillRect(
          position.x + x * @level.GRID_SIZE,
          position.y + y * @level.GRID_SIZE,
          @level.GRID_SIZE, @level.GRID_SIZE
        )

module.exports = LevelActor
