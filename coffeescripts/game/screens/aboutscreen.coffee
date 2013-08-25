BackgroundActor = require "../actors/backgroundactor.coffee"

class AboutScreen extends LDFW.Screen
  constructor: (@app) ->
    super @app

    @backgroundActor = new BackgroundActor @app

    @fontsAtlas   = @app.getFontsAtlas()
    @textFont = new LDFW.BitmapFont(
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
    @keyboard.removeAllListeners "keydown"
    @keyboard.on "keydown", @onKeyDown

  onKeyDown: (e) =>
    return if @blockInput

    if e.keyCode is @keyboard.Keys.ESC
      @game.switchToSplashScreen()
      blockInput = true

  update: (delta) ->
    @backgroundActor.update delta
    return

  drawAboutHeadline: (context) ->
    headlineText = "ABOUT RUNTRIS"
    headlineBounds = @headlineFont.getBounds headlineText
    @headlineFont.drawText context,
      headlineText,
      @app.getWidth() / 2 - headlineBounds.getWidth() / 2,
      60

  drawQuitMessage: (context) ->
    escText = "PRESS ESC "
    quitText = "TO QUIT TO MENU"

    fullQuitText = escText + quitText

    rBounds = @textFont.getBounds escText
    fullBounds = @redFont.getBounds fullQuitText
    @redFont.drawText context, escText, @app.getWidth() / 2 - fullBounds.width / 2, 400
    @textFont.drawText context, quitText, @app.getWidth() / 2 - fullBounds.width / 2 + rBounds.width, 400

  drawAboutText: (context) ->
    text = [
      "Runtris has been created by Sascha Gehlich within",
      "less than 48 hours during the 27th \"Ludum Dare\" ",
      "game development competition in August 2013.",
      "",
      "Tools used: Adobe Photoshop, TexturePacker, Sublime",
      "Text, Google Chrome, bmGlyph, CoffeeScript, node.js",
      "and Redis"
    ]

    yOffset = 150
    lineHeight = 20
    for line in text
      @textFont.drawText context,
        line,
        100,
        yOffset

      yOffset += lineHeight

  draw: (context) ->
    context.save()
    context.fillStyle = "rgba(0, 0, 0, 0.8)"

    @backgroundActor.draw context

    context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

    @drawAboutHeadline context
    @drawAboutText context
    @drawQuitMessage context

    context.restore()

module.exports = AboutScreen
