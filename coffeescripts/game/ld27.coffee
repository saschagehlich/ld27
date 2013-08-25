GameScreen   = require "./screens/gamescreen.coffee"
SplashScreen = require "./screens/splashscreen.coffee"
Mouse        = require "./utilities/mouse.coffee"
Keyboard     = require "./utilities/keyboard.coffee"

class LD27 extends LDFW.Game
  constructor: ->
    super

    @debugDiv = $("<div>").addClass("debug")
    @debugDiv.appendTo @getWrapper()

    @keyboard = new Keyboard()

    @preloader = new LDFW.Preloader [
      "assets/sprites.json",
      "assets/sprites.png",
      "assets/fonts.json",
      "assets/fonts.png",
      "assets/fonts/pixel-8-white.fnt",
      "assets/fonts/pixel-8-red.fnt",
      "assets/fonts/pixel-16-white.fnt",
      "assets/fonts/pixel-16-red.fnt"
    ]
    @preloader.on "done", =>
      spritesJSON = @preloader.get "assets/sprites.json"
      spritesImage = @preloader.get "assets/sprites.png"
      @spritesAtlas = new LDFW.TextureAtlas spritesJSON.frames, spritesImage

      fontsJSON = @preloader.get "assets/fonts.json"
      fontsImage = @preloader.get "assets/fonts.png"
      @fontsAtlas   = new LDFW.TextureAtlas fontsJSON.frames, fontsImage

      @screen       = new SplashScreen this

      @run()
    @preloader.load()

  switchToGameScreen: ->
    @screen = new GameScreen this

  switchToSplashScreen: ->
    @screen = new SplashScreen this

  ###
   * Getters / setters
  ###
  getSpritesAtlas: -> return @spritesAtlas
  getFontsAtlas: -> return @fontsAtlas
  getPreloader: -> return @preloader
  getKeyboard: -> return @keyboard

  setDebugText: (text) ->
    @debugDiv.text text

module.exports = LD27
