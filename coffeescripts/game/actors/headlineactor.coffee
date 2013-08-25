class HeadlineActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @spritesAtlas = @app.getSpritesAtlas()
    @fontsAtlas   = @app.getFontsAtlas()

    @background = @spritesAtlas.createSprite "ui/headline.png"

    @font = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/museo-8-white.fnt"),
      @fontsAtlas.findRegion("museo-8-white.png")
    )
    @redFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/museo-8-red.fnt"),
      @fontsAtlas.findRegion("museo-8-red.png")
    )

  drawPowerupCountdown: (context) ->
    powerupText = "NEXT POWERUP IN "
    powerupTextPosition = new LDFW.Vector2 16, 12
    powerupBounds = @font.getBounds powerupText
    @font.drawText context, powerupText, powerupTextPosition.getX(), powerupTextPosition.getY()

    powerupTimeLeft = Math.ceil(@game.getPowerupTimeleft() / 1000).toString()
    if powerupTimeLeft.length is 1
      powerupTimeLeft = "0" + powerupTimeLeft

    @redFont.drawText context, "0:#{powerupTimeLeft}", powerupTextPosition.getX() + powerupBounds.width, powerupTextPosition.getY()

  drawScore: (context) ->
    scoreOffset = new LDFW.Vector2 16, 12

    scoreText = "#{@game.getScore()}m"
    scoreBounds = @font.getBounds scoreText
    @font.drawText context, scoreText, @app.getWidth() - scoreOffset.getX() - scoreBounds.getWidth(), scoreOffset.getY()

  draw: (context) ->
    @background.draw context

    @drawPowerupCountdown context
    @drawScore context

module.exports = HeadlineActor
