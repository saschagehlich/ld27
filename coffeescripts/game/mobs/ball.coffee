class Ball extends LDFW.Actor
  constructor: ->
    super

    @spritesAtlas = @game.getSpritesAtlas()
    @sprite = @spritesAtlas.createSprite "ball.png"

    @speedX = 4
    @speedY = 4

  update: (delta) ->
    @setPosition(
      @getX() + @speedX,
      @getY() + @speedY
    )
    @sprite.setPosition @getPosition()

    gameWidth = @game.getWidth()
    gameHeight = @game.getHeight()
    if @getX() >= gameWidth - @sprite.getWidth() or
      @getX() <= 0
        @speedX *= -1

    if @getY() >= gameHeight - @sprite.getHeight() or
      @getY() <= 0
        @speedY *= -1

  draw: (context) ->
    @sprite.draw context

module.exports = Ball
