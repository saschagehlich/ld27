class Player
  constructor: (@app, @game) ->
    @keyboard = @game.getKeyboard()

    @speedX = 3
    @velocityX = 0

    @position = new LDFW.Vector2()
    @level = @game.getLevel()

  update: (delta) ->
    ###
     * Keyboard handling
    ###
    if @keyboard.pressed(@keyboard.Keys.RIGHT) or
      @keyboard.pressed(@keyboard.Keys.D)
        @velocityX = 1

    else if @keyboard.pressed(@keyboard.Keys.LEFT) or
      @keyboard.pressed(@keyboard.Keys.A)
        @velocityX = -1

    else
      @velocityX = 0

    ###
     * Move!
    ###
    @position.setX @position.getX() + (@speedX * @velocityX)

    gravity = @level.getGravity()
    @position.setY @position.getY() + gravity

    # Calculate the lower boundary depending on the position
    # and the size of the player
    maxY = @app.getHeight() * 2
    platforms = @level.getPlatforms()

    x = @position.getX()
    w = 32
    for platform in platforms
      unless (platform.position.x > x + w or
        platform.position.x + platform.width < x)
          maxY = platform.position.y

    if @position.getY() > maxY
      @position.setY maxY

    ###
     * Boundaries
    ###
    if @position.getX() < @level.getScroll().x
      @position.setX @level.getScroll().x


  getPosition: -> @position
  setPosition: ->
    @position.set.apply @position, arguments

module.exports = Player
