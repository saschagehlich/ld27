class HighscoreActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @fontsAtlas   = @app.getFontsAtlas()
    @scoreFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )
    @headlineFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-24-white.fnt"),
      @fontsAtlas.findRegion("pixel-24-white.png")
    )
    @redFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-red.fnt"),
      @fontsAtlas.findRegion("pixel-8-red.png")
    )

    @blockInput = false
    @keyboard = @app.getKeyboard()
    @keyboard.on "keydown", (e) =>
      return if @blockInput
      if e.keyCode is @keyboard.Keys.ESC
        @app.switchToSplashScreen()
        @blockInput = true


    @scores = null

  draw: (context) ->
    @drawHeadline context
    unless @scores
      @drawLoading context
    else
      @drawScores context

    @drawQuitMessage context

  drawQuitMessage: (context) ->
    escText = "PRESS ESC "
    quitText = "TO QUIT TO MENU"

    fullQuitText = escText + quitText

    rBounds = @scoreFont.getBounds escText
    fullBounds = @redFont.getBounds fullQuitText
    @redFont.drawText context, escText, @app.getWidth() / 2 - fullBounds.width / 2, 400
    @scoreFont.drawText context, quitText, @app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 400

  drawScores: (context) ->
    yOffset = 130
    for score in @scores.slice(0, 10)
      # Draw name
      @scoreFont.drawText context,
        score.name,
        100,
        yOffset

      # Draw score
      scoreText   = score.score + "m"
      scoreBounds = @scoreFont.getBounds scoreText
      @scoreFont.drawText context,
        scoreText,
        @app.getWidth() - 100 - scoreBounds.width,
        yOffset

      yOffset += 20


  drawHeadline: (context) ->
    headlineText = "HIGHSCORES"
    headlineBounds = @headlineFont.getBounds headlineText
    @headlineFont.drawText context,
      headlineText,
      @app.getWidth() / 2 - headlineBounds.getWidth() / 2,
      60

  drawLoading: (context) ->
    loadingText = "LOADING..."
    loadingBounds = @scoreFont.getBounds loadingText
    @scoreFont.drawText context,
      loadingText,
      @app.getWidth() / 2 - loadingBounds.getWidth() / 2,
      132

  setScores: (@scores) -> return

module.exports = HighscoreActor
