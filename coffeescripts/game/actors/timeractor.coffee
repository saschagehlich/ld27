class TimerActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @fontsAtlas   = @app.getFontsAtlas()

    @timerFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-white.fnt"),
      @fontsAtlas.findRegion("pixel-16-white.png")
    )
    @textFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )

  drawPowerupCountdown: (context) ->
    powerupTimeLeft = Math.ceil(@game.getPowerupTimeleft() / 1000).toString() + " SECONDS"

    timeleftBounds = @timerFont.getBounds powerupTimeLeft
    @timerFont.drawText context, powerupTimeLeft, @app.getWidth() / 2 - timeleftBounds.getWidth() / 2, 340

    untilText = "UNTIL THE NEXT POWERUP"
    untilBounds = @textFont.getBounds untilText
    @textFont.drawText context, untilText, @app.getWidth() / 2 - untilBounds.getWidth() / 2, 370

  draw: (context) ->
    @drawPowerupCountdown context

module.exports = TimerActor
