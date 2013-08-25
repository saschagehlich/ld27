class GameOverStage extends LDFW.Stage
  constructor: (@app, @game) ->
    super @game

    @opacity = 0
    @toOpacity = 0

    @fontsAtlas = @app.getFontsAtlas()

    @booFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-red.fnt"),
      @fontsAtlas.findRegion("pixel-16-red.png")
    )
    @messageFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )
    @scoreFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-white.fnt"),
      @fontsAtlas.findRegion("pixel-16-white.png")
    )

  update: (delta) ->
    @opacity += (@toOpacity - @opacity) / 10

  show: -> @toOpacity = 1
  hide: -> @toOpacity = 0

  draw: (context) ->
    context.save()

    context.globalAlpha = @opacity

    appWidth = @app.getWidth()
    appHeight = @app.getHeight()

    context.fillStyle = "rgba(0, 0, 0, 0.8)"
    context.fillRect 0, 0, appWidth, appHeight

    @drawMessage context

    context.restore()

  drawMessage: (context) ->
    booText = "BOO!"
    booBounds = @booFont.getBounds booText
    @booFont.drawText context, booText, @app.getWidth() / 2 - booBounds.width / 2, 150

    lostText = "YOU LOST THE GAME!"
    lostBounds = @messageFont.getBounds lostText
    @messageFont.drawText context, lostText, @app.getWidth() / 2 - lostBounds.width / 2, 200

    cantWinText = "ACTUALLY, YOU CAN'T WIN."
    cantWinBounds = @messageFont.getBounds cantWinText
    @messageFont.drawText context, cantWinText, @app.getWidth() / 2 - cantWinBounds.width / 2, 222

    yourScoreText = "YOUR SCORE:"
    yourScoreBounds = @messageFont.getBounds yourScoreText
    @messageFont.drawText context, yourScoreText, @app.getWidth() / 2 - yourScoreBounds.width / 2, 270

    scoreText = "#{@game.getScore()}m"
    scoreBounds = @scoreFont.getBounds scoreText
    @scoreFont.drawText context, scoreText, @app.getWidth() / 2 - scoreBounds.width / 2, 295


module.exports = GameOverStage
