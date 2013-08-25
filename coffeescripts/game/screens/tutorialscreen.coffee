BackgroundActor = require "../actors/backgroundactor.coffee"

class TutorialScreen extends LDFW.Screen
  constructor: (@app) ->
    super @app

    @spritesAtlas = @app.getSpritesAtlas()

    @stepIndex = 0
    @steps = [
      {
        title: "MOVING AROUND",
        sprite: @spritesAtlas.createSprite("tutorial/tutorial-moving.png")
      },
      {
        title: "BUILDING BLOCKS",
        sprite: @spritesAtlas.createSprite("tutorial/tutorial-building.png")
      },
      {
        title: "BEWARE OF POWERUPS",
        sprite: @spritesAtlas.createSprite("tutorial/tutorial-powerups.png")
      }
    ]

    @backgroundActor = new BackgroundActor @app

    @fontsAtlas   = @app.getFontsAtlas()
    @headlineFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-24-white.fnt"),
      @fontsAtlas.findRegion("pixel-24-white.png")
    )
    @subFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-16-red.fnt"),
      @fontsAtlas.findRegion("pixel-16-red.png")
    )
    @smallFont = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )

    @blockInput = false
    @keyboard = @app.getKeyboard()
    @keyboard.removeAllListeners "keydown"
    @keyboard.on "keydown", @onKeyDown

  onKeyDown: (e) =>
    return if @blockInput

    if e.keyCode is @keyboard.Keys.ENTER
      @stepIndex++
      if @stepIndex > @steps.length - 1
        @blockInput = true
        localStorage.setItem("seen_tutorial", true)
        @app.switchToGameScreen()

  update: (delta) ->
    @backgroundActor.update delta
    return

  drawAboutHeadline: (context) ->
    headlineText = "TUTORIAL"
    headlineBounds = @headlineFont.getBounds headlineText
    @headlineFont.drawText context,
      headlineText,
      @app.getWidth() / 2 - headlineBounds.getWidth() / 2,
      50

  drawTutorialStep: (context) ->
    step = @steps[@stepIndex]

    titleText = step.title
    titleBounds = @subFont.getBounds titleText
    @subFont.drawText context,
      titleText,
      @app.getWidth() / 2 - titleBounds.getWidth() / 2,
      94

    if @stepIndex < @steps.length - 1
      instructionText = "PRESS ENTER TO SEE THE NEXT TIP"
    else
      instructionText = "PRESS ENTER TO START THE GAME"

    instructionBounds = @smallFont.getBounds instructionText
    @smallFont.drawText context,
      instructionText,
      @app.getWidth() / 2 - instructionBounds.getWidth() / 2,
      126

    sprite = step.sprite
    sprite.draw context,
      @app.getWidth() / 2 - sprite.getWidth() / 2,
      160

  draw: (context) ->
    context.save()
    context.fillStyle = "rgba(0, 0, 0, 0.8)"

    @backgroundActor.draw context

    context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

    @drawAboutHeadline context
    @drawTutorialStep context

    context.restore()

module.exports = TutorialScreen
