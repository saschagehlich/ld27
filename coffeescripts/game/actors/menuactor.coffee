Keyboard = require "../utilities/keyboard.coffee"

class MenuActor extends LDFW.Actor
  constructor: (@app) ->
    super @app

    @fontsAtlas   = @app.getFontsAtlas()
    @opacity = 0

    @menuFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-white.fnt"),
      @fontsAtlas.findRegion("pixel-16-white.png")
    )

    @selectedIndex = 0
    @options = [
      "START",
      "HIGHSCORE",
      "ABOUT"
    ]

  onKeyDown: (e) =>
    keyboard = @app.getKeyboard()

    if e.keyCode is keyboard.Keys.UP
      @selectedIndex--
      if @selectedIndex < 0
        @selectedIndex = @options.length - 1
    else if e.keyCode is keyboard.Keys.DOWN
      @selectedIndex++
      if @selectedIndex > @options.length - 1
        @selectedIndex = 0

  update: (delta) ->
    @opacity += delta
    @opacity = Math.min(1, @opacity)

  draw: (context) ->
    context.save()
    context.globalAlpha = @opacity

    yOffset = 250
    lineHeight = 40

    for option, i in @options
      optionText = option
      if @selectedIndex is i
        optionText = "[ #{option} ]"

      optionBounds = @menuFont.getBounds optionText
      @menuFont.drawText context, optionText,
        @app.getWidth() / 2 - optionBounds.width / 2,
        yOffset + i * lineHeight

    context.restore()

  getSelectedIndex: -> @selectedIndex

module.exports = MenuActor
