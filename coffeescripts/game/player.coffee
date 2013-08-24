JUMP_FORCE = -700
SPEED_X = 300

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

    @handleXMovement aspiredPosition
    @handleYMovement aspiredPosition

    @position.set aspiredPosition

  getAspiredPosition: (delta) ->
    gravity = @level.getGravity().clone()
    gravityStep = gravity.multiply(delta)

    @velocity.add gravityStep
    velocityStep = @velocity.clone().multiply(delta)

    return @position.clone().add velocityStep

  handleXMovement: (aspiredPosition) ->
    # Don't let the player walk out of the left edge
    if aspiredPosition.getX() < @level.getScroll().x
      aspiredPosition.setX @level.getScroll().x

    hBoundaries = @level.getHorizontalBoundariesForPlayer this

    if aspiredPosition.getX() <= hBoundaries.min
      aspiredPosition.setX hBoundaries.min
    else if aspiredPosition.getX() + @getWidth() >= hBoundaries.max
      aspiredPosition.setX hBoundaries.max - @getWidth()

  handleYMovement: (aspiredPosition) ->
    # Calculate the lower boundary depending on the position
    # and the size of the player
    maxY = @level.getHighestPointForPlayer this
    if aspiredPosition.getY() > maxY
      aspiredPosition.setY maxY

    if aspiredPosition.getY() >= maxY
      @jumping = false
      @onGround = true
      @velocity.setY 0
    else
      @onGround = false

  handleKeyboard: ->
    if @keyboard.pressed(@keyboard.Keys.RIGHT) or
      @keyboard.pressed(@keyboard.Keys.D)
        @velocity.setX SPEED_X

    else if @keyboard.pressed(@keyboard.Keys.LEFT) or
      @keyboard.pressed(@keyboard.Keys.A)
        @velocity.setX -SPEED_X

    else
      @velocity.setX 0

    if @keyboard.upPressed() and @onGround
      @velocity.setY JUMP_FORCE

  getWidth: -> 32

  getPosition: -> @position
  setPosition: ->
    @position.set.apply @position, arguments

module.exports = Player
