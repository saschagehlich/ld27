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
    @redFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-red.fnt"),
      @fontsAtlas.findRegion("pixel-8-red.png")
    )
    @scoreFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-white.fnt"),
      @fontsAtlas.findRegion("pixel-16-white.png")
    )

    @keyboard = @app.getKeyboard()
    @keyboard.on "keydown", @onKeyDown

    @visible = false

  onKeyDown: (e) =>
    return unless @visible
    if e.keyCode is @keyboard.Keys.R
      @app.switchToGameScreen()
    else if e.keyCode is @keyboard.Keys.ESC
      @app.switchToSplashScreen()
    else if e.keyCode is @keyboard.Keys.ENTER
      @app.shareScore @game.getScore()

  update: (delta) ->
    @opacity += (@toOpacity - @opacity) / 10

  show: ->
    @toOpacity = 1
    @visible = true

  hide: ->
    @toOpacity = 0
    @visible = false

  draw: (context) ->
    context.save()

    context.globalAlpha = @opacity

    appWidth = @app.getWidth()
    appHeight = @app.getHeight()

    context.fillStyle = "rgba(0, 0, 0, 0.8)"
    context.fillRect 0, 0, appWidth, appHeight

    @drawMessage context
    @drawScore context
    @drawInstructions context

    context.restore()

  drawScore: (context) ->
    yourScoreText = "YOUR SCORE:"
    yourScoreBounds = @messageFont.getBounds yourScoreText
    @messageFont.drawText context, yourScoreText, @app.getWidth() / 2 - yourScoreBounds.width / 2, 230

    scoreText = "#{@game.getScore()}m"
    scoreBounds = @scoreFont.getBounds scoreText
    @scoreFont.drawText context, scoreText, @app.getWidth() / 2 - scoreBounds.width / 2, 250

  drawInstructions: (context) ->
    rText = "PRESS R "
    retryText = "TO TRY AGAIN"

    fullRetryText = rText + retryText

    rBounds = @messageFont.getBounds rText
    fullBounds = @redFont.getBounds fullRetryText
    @redFont.drawText context, rText, @app.getWidth() / 2 - fullBounds.width / 2, 330
    @messageFont.drawText context, retryText, @app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 330

    escText = "PRESS ESC "
    quitText = "TO QUIT TO MENU"

    fullQuitText = escText + quitText

    rBounds = @messageFont.getBounds escText
    fullBounds = @redFont.getBounds fullQuitText
    @redFont.drawText context, escText, @app.getWidth() / 2 - fullBounds.width / 2, 350
    @messageFont.drawText context, quitText, @app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 350

    enterText = "PRESS ENTER "
    highscoreText = "TO ADD YOUR SCORE TO THE HIGHSCORE TABLE"

    fullHighscoreText = enterText + highscoreText

    rBounds = @messageFont.getBounds enterText
    fullBounds = @redFont.getBounds fullHighscoreText
    @redFont.drawText context, enterText, @app.getWidth() / 2 - fullBounds.width / 2, 370
    @messageFont.drawText context, highscoreText, @app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 370

  drawMessage: (context) ->
    booText = "BOO!"
    booBounds = @booFont.getBounds booText
    @booFont.drawText context, booText, @app.getWidth() / 2 - booBounds.width / 2, 75

    lostText = "YOU LOST THE GAME!"
    lostBounds = @messageFont.getBounds lostText
    @messageFont.drawText context, lostText, @app.getWidth() / 2 - lostBounds.width / 2, 131

    cantWinText = "ACTUALLY, YOU CAN'T WIN."
    cantWinBounds = @messageFont.getBounds cantWinText
    @messageFont.drawText context, cantWinText, @app.getWidth() / 2 - cantWinBounds.width / 2, 151

    dontTellText = "PLEASE DON'T TELL ANYONE."
    dontTellBounds = @messageFont.getBounds dontTellText
    @messageFont.drawText context, dontTellText, @app.getWidth() / 2 - dontTellBounds.width / 2, 171


module.exports = GameOverStage
