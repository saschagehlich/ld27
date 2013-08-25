Config   = require "./config/config.json"

Platform = require "./entities/platform.coffee"
LevelGenerator = require "./utilities/levelgenerator.coffee"
Powerups = require "./powerups.coffee"

BlockActor = require "./actors/blockactor.coffee"
FuckingPiranhasActor = require "./actors/fuckingpiranhasactor.coffee"

class Level
  GRID_SIZE: 32
  BUILDMODE_COOLDOWN: 300
  constructor: (@app, @game) ->
    @renderOffset = new LDFW.Vector2(0, Config.ui_minimap_height)

    @buildMode = true
    @buildBlock = new BlockActor @app, @game, this, buildMode: true

    @keyboard = @game.getKeyboard()
    @keyboard.on "keydown", @onKeyDown

    @mouse = @game.getMouse()
    @mouse.on "click", @onClick
    @mouse.on "rightclick", @onRightClick

    @defaultGravity = new LDFW.Vector2(0, 1800)
    @gravity = @defaultGravity.clone()

    @generator = new LevelGenerator @app, @game, this

    @platforms = [
      new Platform(@app, @game,
        position: new LDFW.Vector2(10, 10)
        width: 10,
        height: 5
      )
    ]
    @blocks = []

    appTileHeight = Math.round @app.getHeight() / @GRID_SIZE
    @obstacles = []

    @generator.generate 10

  onKeyDown: (event) =>
    return unless @buildMode
    if event.keyCode in [@keyboard.Keys.R, @keyboard.Keys.SHIFT]
      @buildBlock.rotate()

  onRightClick: (position) =>
    return if @game.isOver()
    return unless @buildMode
    @buildBlock.rotate()

  onClick: (position) =>
    return if @game.isOver()
    return unless @buildMode
    return unless @isBuildBlockBuildable()

    @buildBlock.setBuildMode false
    @buildMode = false

    @blocks.push @buildBlock
    @buildBlock = null

    @buildMode = false
    @buildBlock = new BlockActor @app, @game, this, buildMode: true

    @buildModeCooldownStart = Date.now()

  update: (delta) ->
    if Date.now() - @buildModeCooldownStart > @BUILDMODE_COOLDOWN
      @buildMode = true

    if @game.getActivePowerup() == Powerups.BROKEN_BLOCKS and @buildMode
      @buildBlock.setStyle "broken"
    else
      @buildBlock.setDefaultStyle()

    if @game.getActivePowerup() == Powerups.LOW_GRAVITY
      @gravity.setY @defaultGravity.getY() / 2
    else
      @gravity.setY @defaultGravity.getY()

    if @game.getActivePowerup() == Powerups.EARTHQUAKE
      @game.globalRenderOffset = new LDFW.Vector2(-10 + Math.random() * 20, -10 + Math.random() * 20)
    else
      @game.globalRenderOffset = new LDFW.Vector2(0, 0)

    if @game.getActivePowerup() == Powerups.BOOST
      @game.setScrollSpeed @game.getDefaultScrollSpeed() * 1.5
    else if @game.getActivePowerup() == Powerups.SLOW
      @game.setScrollSpeed @game.getDefaultScrollSpeed() * 0.5
    else
      @game.setDefaultScrollSpeed()

    mousePosition = @mouse.getPosition()

    if @buildMode
      blockMap = @buildBlock.getMap()
      gridPosition = mousePosition.clone()
        .add(@getScroll())
        .substract(
          blockMap[0].length * @GRID_SIZE / 2,
          blockMap.length * @GRID_SIZE / 2
        )
        .divideBy(@GRID_SIZE)
        .round()

      @buildBlock.setGridPosition gridPosition

    for obstacle in @obstacles
      if @game.getPlayer().collidesWithObstacle obstacle
        @game.endGame()

  isBuildBlockBuildable: ->
    # Does the building block overlap any
    # of the existing blocks?
    buildable = true
    buildableBlockMap      = @buildBlock.getMap()
    buildableBlockPosition = @buildBlock.getGridPosition()

    for block in @blocks
      map      = block.getMap()
      position = block.getGridPosition()

      continue if position.x * @GRID_SIZE + map[0].length * @GRID_SIZE - @game.getScroll().x < 0

      for row, y in map
        for segment, x in row
          continue if segment is 0

          offsetX = position.x + x - buildableBlockPosition.x
          offsetY = position.y + y - buildableBlockPosition.y

          if buildableBlockMap[offsetY]? and buildableBlockMap[offsetY][offsetX]?
            buildableSegment = buildableBlockMap[offsetY][offsetX]
            if buildableSegment isnt 0
              buildable = false

    return buildable

  getBoundariesForPlayer: (player) ->
    player =
      top: player.getPosition().getY() - player.getWidth()
      bottom: player.getPosition().getY()
      left: player.getPosition().getX()
      right: player.getPosition().getX() + player.getHeight()

    boundaries =
      x:
        min: 0
        max: player.left + @app.getWidth()
        object: null
      y:
        min: -@app.getHeight()
        max: @app.getHeight() * 2
        object: null

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

          yOffset = segment.getOffset().getY()
          segment =
            left: position.getX() + x * @GRID_SIZE
            right: position.getX() + (x + 1) * @GRID_SIZE
            top: position.getY() + y * @GRID_SIZE + yOffset
            bottom: position.getY() + (y + 1) * @GRID_SIZE + yOffset

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

              if boundaries.y.max is segment.top
                boundaries.y.object = block

    return boundaries

  addPlatform: (platform) -> @platforms.push platform
  addObstacle: (obstacle) -> @obstacles.push obstacle

  getScroll: ->
    return @game.getScroll().clone().add(@renderOffset)
  getPlatforms: -> @platforms
  getBlocks: -> @blocks
  getObstacles: -> @obstacles
  getGravity: -> @gravity
  inBuildMode: -> @buildMode
  setBuildMode: (@buildMode) -> return
  getBuildBlock: -> @buildBlock
  getScrollSpeed: -> @scrollSpeed

module.exports = Level
