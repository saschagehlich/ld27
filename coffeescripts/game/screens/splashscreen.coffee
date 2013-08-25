BackgroundActor = require "../actors/backgroundactor.coffee"
LogoActor = require "../actors/logoactor.coffee"
FooterActor = require "../actors/footeractor.coffee"
MenuActor = require "../actors/menuactor.coffee"

class SplashScreen extends LDFW.Screen
  constructor: (@app) ->
    super @app

    @backgroundActor = new BackgroundActor @app
    @footerActor = new FooterActor @app
    @logoActor = new LogoActor @app
    @menuActor = new MenuActor @app

    @blockInput = false

    @keyboard = @app.getKeyboard()
    @keyboard.removeAllListeners "keydown"
    @keyboard.on "keydown", @onKeyDown

  onKeyDown: (e) =>
    return if @blockInput

    if e.keyCode is @keyboard.Keys.ENTER
      switch @menuActor.getSelectedIndex()
        when 0
          @app.switchToTutorialScreen()
          @blockInput = true
          return
        when 1
          @app.switchToHighScoreScreen()
          @blockInput = true
          return
        when 2
          @app.switchToAboutScreen()
          @blockInput = true
          return

    @menuActor.onKeyDown e

  update: (delta) ->
    @backgroundActor.update delta
    @footerActor.update delta
    @logoActor.update delta
    @menuActor.update delta

  draw: (context) ->
    @backgroundActor.draw context
    @footerActor.draw context
    @logoActor.draw context
    @menuActor.draw context

module.exports = SplashScreen
