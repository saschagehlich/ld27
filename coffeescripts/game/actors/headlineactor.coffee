class HeadlineActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @fontOffset = new LDFW.Vector2 16, 8

    @spritesAtlas = @app.getSpritesAtlas()
    @fontsAtlas   = @app.getFontsAtlas()

    @background = @spritesAtlas.createSprite "ui/headline.png"

    @font = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )
    @redFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-red.fnt"),
      @fontsAtlas.findRegion("pixel-8-red.png")
    )

  drawPowerupCountdown: (context) ->
    powerupText = "NEXT POWERUP IN "
    powerupBounds = @font.getBounds powerupText
    @font.drawText context, powerupText, @fontOffset.getX(), @fontOffset.getY()

    powerupTimeLeft = Math.ceil(@game.getPowerupTimeleft() / 1000).toString()
    if powerupTimeLeft.length is 1
      powerupTimeLeft = "0" + powerupTimeLeft

    @redFont.drawText context, "0:#{powerupTimeLeft}", @fontOffset.getX() + powerupBounds.width, @fontOffset.getY()

  drawScore: (context) ->
    scoreText = "#{@game.getScore()}m"
    scoreBounds = @font.getBounds scoreText
    @font.drawText context, scoreText, @app.getWidth() - @fontOffset.getX() - scoreBounds.getWidth(), @fontOffset.getY()

  draw: (context) ->
    @background.draw context

    @drawPowerupCountdown context
    @drawScore context

module.exports = HeadlineActor
