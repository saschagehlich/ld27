class PowerupActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @fontsAtlas = @app.getFontsAtlas()
    @powerupFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-white.fnt"),
      @fontsAtlas.findRegion("pixel-16-white.png")
    )
    @subFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )

  draw: (context) ->
    powerup = @game.getActivePowerup()
    return unless powerup?

    powerupBounds = @powerupFont.getBounds powerup.name

    @powerupFont.drawText context, powerup.name,
      @app.getWidth() / 2 - powerupBounds.width / 2,
      50

    subBounds = @subFont.getBounds powerup.sub

    @subFont.drawText context, powerup.sub,
      @app.getWidth() / 2 - subBounds.width / 2,
      50 + powerupBounds.height + 4

module.exports = PowerupActor
