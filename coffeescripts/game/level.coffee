Config   = require "./config/config.json"
Block    = require "./entities/block.coffee"
Platform = require "./entities/platform.coffee"
LevelGenerator = require "./utilities/levelgenerator.coffee"

FuckingPiranhasActor = require "./actors/fuckingpiranhasactor.coffee"

class Level
  GRID_SIZE: 32
  constructor: (@app, @game) ->
    @scrollSpeed = 150

    @buildMode = true
    @buildBlock = new Block @app, @game, buildMode: true

    @keyboard = @game.getKeyboard()
    @keyboard.on "keydown", @onKeyDown

    @mouse = @game.getMouse()
    @mouse.on "click", @onClick
    @mouse.on "rightclick", @onRightClick

    @scroll = new LDFW.Vector2(0, Config.ui_minimap_height)
    @gravity = new LDFW.Vector2(0, 1800)

    @generator = new LevelGenerator @app, @game, this

    @platforms = [
      new Platform(@app, @game,
        position: new LDFW.Vector2(2, 10)
        width: 10,
        height: 10
      )
    ]
    @blocks = []

    appTileHeight = Math.round @app.getHeight() / @GRID_SIZE
    @obstacles = [
      new FuckingPiranhasActor(@app, @game, {
        position: new LDFW.Vector2(14, appTileHeight - 6)
      })
    ]

    @generator.generate 1, 5


  onKeyDown: (event) =>
    return unless @buildMode
    if event.keyCode in [@keyboard.Keys.R, @keyboard.Keys.SHIFT]
      @buildBlock.rotate()

  onRightClick: (position) =>
    return unless @buildMode
    @buildBlock.rotate()

  onClick: (position) =>
    return unless @buildMode
    return unless @isBuildBlockBuildable()

    @buildBlock.setBuildMode false
    @buildMode = false

    @blocks.push @buildBlock
    @buildBlock = null

    # for development
    @buildMode = true
    @buildBlock = new Block @app, @game, buildMode: true

  update: (delta) ->
    @scroll.setX Math.round(@scroll.getX() + @scrollSpeed * delta)

    mousePosition = @mouse.getPosition()

    if @buildMode
      blockMap = @buildBlock.getMap()
      gridPosition = mousePosition.clone()
        .add(@scroll)
        .substract(
          blockMap[0].length * @GRID_SIZE / 2,
          blockMap.length * @GRID_SIZE / 2
        )
        .divideBy(@GRID_SIZE)
        .round()

      @buildBlock.setGridPosition gridPosition

    for obstacle in @obstacles
      if @game.getPlayer().collidesWithObstacle obstacle
        console.log "u dead."

  isBuildBlockBuildable: ->
    # Does the building block overlap any
    # of the existing blocks?
    buildable = true
    buildableBlockMap      = @buildBlock.getMap()
    buildableBlockPosition = @buildBlock.getGridPosition()

    for block in @blocks
      map      = block.getMap()
      position = block.getGridPosition()

      for row, y in map
        for segment, x in row
          continue if segment is 0

          offset = new LDFW.Vector2(
            position.getX() + x - buildableBlockPosition.getX(),
            position.getY() + y - buildableBlockPosition.getY()
          )

          if buildableBlockMap[offset.y]? and buildableBlockMap[offset.y][offset.x]?
            buildableSegment = buildableBlockMap[offset.y][offset.x]
            if buildableSegment is 1
              buildable = false

    return buildable

  getBoundariesForPlayer: (player) ->
    playerWidth = 32
    playerHeight = 64
    player =
      top: player.getPosition().getY() - playerHeight
      bottom: player.getPosition().getY()
      left: player.getPosition().getX()
      right: player.getPosition().getX() + playerWidth

    boundaries =
      x:
        min: 0, max: player.left + @app.getWidth()
      y:
        min: -@app.getHeight(), max: @app.getHeight() * 2

    # Platform collision check
    for platform in @platforms
      position = platform.getPosition()
        .clone()
        .multiply(@GRID_SIZE)

      platform =
        top: position.y
        bottom: position.y + platform.getHeight() * @GRID_SIZE
        left: position.x
        right: position.x + platform.getWidth() * @GRID_SIZE

      # Horizontal collision check
      unless player.bottom <= platform.top or
        player.top >= platform.bottom
          if player.right <= platform.left
            boundaries.x.max = Math.min(platform.left, boundaries.x.max)
          else if player.left >= platform.right
            boundaries.x.min = Math.max(platform.right, boundaries.x.min)

      # Vertical collision check
      unless player.right < platform.left or
        player.left > platform.right or
        player.bottom > platform.top
          boundaries.y.max = Math.min(platform.top, boundaries.y.max)

    # Blocks collision check
    for block in @blocks
      map = block.getMap()
      position = block.getGridPosition()
        .clone()
        .multiply(@GRID_SIZE)

      for row, y in map
        for segment, x in row
          continue if segment is 0

          segment =
            left: position.getX() + x * @GRID_SIZE
            right: position.getX() + (x + 1) * @GRID_SIZE
            top: position.getY() + y * @GRID_SIZE
            bottom: position.getY() + (y + 1) * @GRID_SIZE

          # Horizontal collision check
          unless player.bottom <= segment.top or player.top >= segment.bottom
            if player.right <= segment.left
              boundaries.x.max = Math.min(segment.left, boundaries.x.max)
            else if player.left >= segment.right
              boundaries.x.min = Math.max(segment.right, boundaries.x.min)

          # Vertical collision check
          unless player.left > segment.right or
            player.right < segment.left or
            player.bottom > segment.top
              boundaries.y.max = Math.min(segment.top, boundaries.y.max)

    return boundaries

  addPlatform: (platform) -> @platforms.push platform

  getScroll: -> @scroll
  getPlatforms: -> @platforms
  getBlocks: -> @blocks
  getObstacles: -> @obstacles
  getGravity: -> @gravity
  inBuildMode: -> @buildMode
  getBuildBlock: -> @buildBlock
  getScrollSpeed: -> @scrollSpeed

module.exports = Level
