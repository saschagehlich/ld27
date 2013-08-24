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
    ###
     * Keyboard handling
    ###
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

    gravity = @level.getGravity().clone()
    gravityStep = gravity.multiply(delta)

    @velocity.add gravityStep
    velocityStep = @velocity.clone().multiply(delta)

    @position.add velocityStep

    ###
     * Boundaries
    ###
    if @position.getX() < @level.getScroll().x
      @position.setX @level.getScroll().x

    # Calculate the lower boundary depending on the position
    # and the size of the player
    maxY = @level.getHighestPointForPlayer this
    if @position.getY() > maxY
      @position.setY maxY

    if @position.getY() >= maxY
      @jumping = false
      @onGround = true
      @velocity.setY 0
    else
      @onGround = false

  getPosition: -> @position
  setPosition: ->
    @position.set.apply @position, arguments

module.exports = Player
