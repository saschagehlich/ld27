GameScreen   = require "./screens/gamescreen.coffee"
Mouse        = require "./utilities/mouse.coffee"
Keyboard     = require "./utilities/keyboard.coffee"


class LD27 extends LDFW.Game
  constructor: ->
    super

    @debugDiv = $("<div>").addClass("debug")
    @debugDiv.appendTo @getWrapper()

    @preloader = new LDFW.Preloader [
      "assets/sprites.json",
      "assets/sprites.png",
      "assets/fonts.json",
      "assets/fonts.png",
      "assets/fonts/pixel-8-white.fnt",
      "assets/fonts/pixel-8-red.fnt",
      "assets/fonts/pixel-16-white.fnt"
    ]
    @preloader.on "done", =>
      spritesJSON = @preloader.get "assets/sprites.json"
      spritesImage = @preloader.get "assets/sprites.png"
      @spritesAtlas = new LDFW.TextureAtlas spritesJSON.frames, spritesImage

      fontsJSON = @preloader.get "assets/fonts.json"
      fontsImage = @preloader.get "assets/fonts.png"
      @fontsAtlas   = new LDFW.TextureAtlas fontsJSON.frames, fontsImage

      @gameScreen   = new GameScreen this
      @screen       = @gameScreen

      @run()
    @preloader.load()

  ###
   * Getters / setters
  ###
  getSpritesAtlas: -> return @spritesAtlas
  getFontsAtlas: -> return @fontsAtlas
  getPreloader: -> return @preloader

  setDebugText: (text) ->
    @debugDiv.text text

module.exports = LD27
