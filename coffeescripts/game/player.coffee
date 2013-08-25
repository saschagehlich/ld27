JUMP_FORCE = -700

BlockActor = require "./actors/blockactor.coffee"

class Player
  constructor: (@app, @game) ->
    @keyboard = @game.getKeyboard()

    @velocity = new LDFW.Vector2()
    @position = new LDFW.Vector2()
    @level = @game.getLevel()

    @width = 0
    @height = 0

    @onGround = false
    @onGroundObject = false

    @direction = 1

  setWidth: (@width) -> return
  setHeight: (@height) -> return
  setSize: (@width, @height) -> return
  getWidth: -> @width
  getHeight: -> @height
  getDirection: -> @direction
  isOnGround: -> @onGround
  getOnGroundObject: -> @onGroundObject
  getVelocity: -> @velocity

  update: (delta) ->
    unless @game.isOver()
      @handleKeyboard()

    aspiredPosition = @getAspiredPosition delta

    unless @game.isOver()
      boundaries      = @level.getBoundariesForPlayer this

      @handleXMovement aspiredPosition, boundaries
      @handleYMovement aspiredPosition, boundaries

    @position.set aspiredPosition

    if @position.getY() > @app.getHeight() + @height
      @game.endGame()

  getAspiredPosition: (delta) ->
    gravity = @level.getGravity().clone()
    gravityStep = gravity.multiply(delta)

    @velocity.add gravityStep
    velocityStep = @velocity.clone().multiply(delta)

    if @velocity.getX() > 0
      @direction = 1
    else if @velocity.getX() < 0
      @direction = -1

    return @position.clone().add velocityStep

  handleXMovement: (aspiredPosition, boundaries) ->
    # Don't let the player walk out of the left edge
    if aspiredPosition.getX() < @level.getScroll().x
      aspiredPosition.setX @level.getScroll().x
    if aspiredPosition.getX() > @level.getScroll().x + @app.getWidth() - @getWidth()
      aspiredPosition.setX @level.getScroll().x + @app.getWidth() - @getWidth()

    if aspiredPosition.getX() <= boundaries.x.min
      aspiredPosition.setX boundaries.x.min
    else if aspiredPosition.getX() + @getWidth() >= boundaries.x.max
      aspiredPosition.setX boundaries.x.max - @getWidth()

  handleYMovement: (aspiredPosition, boundaries) ->
    if aspiredPosition.getY() > boundaries.y.max
      aspiredPosition.setY boundaries.y.max

    if aspiredPosition.getY() >= boundaries.y.max
      @jumping = false
      @onGround = true
      @velocity.setY 0
    else
      @onGround = false

    if @onGround and boundaries.y.object instanceof BlockActor
      @onGroundObject = boundaries.y.object
      obj = boundaries.y.object
      obj.steppedOn(
        aspiredPosition.getX() -
        obj.getGridPosition().getX() * @level.GRID_SIZE,
        @getWidth()
      )
    else if @onGround
      @onGroundObject = false

  collidesWithObstacle: (obstacle) ->
    obstaclePosition = obstacle.getPosition()
      .clone()
      .multiply(@level.GRID_SIZE)

    obstacle =
      top: obstaclePosition.y
      right: obstaclePosition.x + obstacle.getWidth() * @level.GRID_SIZE
      bottom: obstaclePosition.y + obstacle.getHeight() * @level.GRID_SIZE
      left: obstaclePosition.x

    player =
      top: @position.getY() + @getHeight()
      right: @position.getX() + @getWidth()
      bottom: @position.getY()
      left: @position.getX()

    unless player.left > obstacle.right or player.right < obstacle.left or
      player.bottom < obstacle.top or player.top > obstacle.bottom
        return true

    return false


  handleKeyboard: ->
    if @keyboard.pressed(@keyboard.Keys.RIGHT) or
      @keyboard.pressed(@keyboard.Keys.D)
        @velocity.setX @game.getScrollSpeed() * 2
    else if @keyboard.pressed(@keyboard.Keys.LEFT) or
      @keyboard.pressed(@keyboard.Keys.A)
        @velocity.setX -@game.getScrollSpeed() * 2
    else
      @velocity.setX 0

    if @keyboard.upPressed() and @onGround
      @velocity.setY JUMP_FORCE

  getPosition: -> @position
  setPosition: ->
    @position.set.apply @position, arguments

module.exports = Player
