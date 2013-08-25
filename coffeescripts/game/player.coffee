JUMP_FORCE = -700

class Player
  constructor: (@app, @game) ->
    @keyboard = @game.getKeyboard()

    @velocity = new LDFW.Vector2()
    @position = new LDFW.Vector2()
    @level = @game.getLevel()

    @onGround = false

  update: (delta) ->
    @handleKeyboard()

    aspiredPosition = @getAspiredPosition delta
    boundaries      = @level.getBoundariesForPlayer this

    @handleXMovement aspiredPosition, boundaries
    @handleYMovement aspiredPosition, boundaries

    @position.set aspiredPosition

  getAspiredPosition: (delta) ->
    gravity = @level.getGravity().clone()
    gravityStep = gravity.multiply(delta)

    @velocity.add gravityStep
    velocityStep = @velocity.clone().multiply(delta)

    return @position.clone().add velocityStep

  handleXMovement: (aspiredPosition, boundaries) ->
    # Don't let the player walk out of the left edge
    if aspiredPosition.getX() < @level.getScroll().x
      aspiredPosition.setX @level.getScroll().x

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

  getWidth: -> 32
  getHeight: -> 64

  getPosition: -> @position
  setPosition: ->
    @position.set.apply @position, arguments

module.exports = Player
