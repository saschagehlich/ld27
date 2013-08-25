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

  drawScore: (context) ->
    scoreText = "#{@game.getScore()}m"
    scoreBounds = @font.getBounds scoreText
    @font.drawText context, scoreText, @app.getWidth() - @fontOffset.getX() - scoreBounds.getWidth(), @fontOffset.getY()

  drawPowerup: (context) ->
    ### Draw powerup ###
    if powerup = @game.getActivePowerup()
      captionText = "CURRENT POWERUP: "
      powerupText = powerup.sub

      fullText = captionText + powerupText
      fullBounds = @redFont.getBounds fullText

      captionBounds = @font.getBounds captionText
      powerupBounds = @redFont.getBounds powerupText
      @font.drawText context, captionText, @app.getWidth() / 2 - fullBounds.getWidth() / 2, @fontOffset.getY()
      @redFont.drawText context, powerupText, @app.getWidth() / 2 - fullBounds.getWidth() / 2 + captionBounds.getWidth(), @fontOffset.getY()

  draw: (context) ->
    @background.draw context

    @drawScore context
    @drawPowerup context

module.exports = HeadlineActor
