class PlayerActor extends LDFW.Actor
  constructor: (@app, game) ->
    super @game

    @game  = game
    @level = @game.getLevel()

    @spritesAtlas = @app.getSpritesAtlas()

    @idleSprite = @spritesAtlas.createSprite "player/idle.png"
    @player = @game.getPlayer()
    @player.setSize @idleSprite.getWidth(), @idleSprite.getHeight()

    @runAnimSprite = @spritesAtlas.createAnimSprite "player/run.png", 2, 0.05
    @offgroundAnimSprite = @spritesAtlas.createAnimSprite "player/offground.png", 3, 0.1

  update: (delta) ->
    @runAnimSprite.update delta
    @offgroundAnimSprite.update delta

  draw: (context) ->
    playerPosition = @player.getPosition()
    scroll = @level.getScroll()

    rx = playerPosition.x - scroll.getX()
    ry = playerPosition.y - @idleSprite.getHeight() - scroll.getY()

    mirrored = @player.getDirection() == -1

    unless @player.isOnGround()
      @offgroundAnimSprite.draw context, rx, ry, mirrored
    else if @player.getVelocity().getX() isnt 0
      @runAnimSprite.draw context, rx, ry, mirrored
    else
      @idleSprite.draw context, rx, ry, mirrored


module.exports = PlayerActor
