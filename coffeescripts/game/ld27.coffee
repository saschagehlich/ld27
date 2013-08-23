GameScreen   = require "./screens/gamescreen.coffee"

class LD27 extends LDFW.Game
  constructor: ->
    super

    @preloader = new LDFW.Preloader [
      "assets/sprites.json",
      "assets/sprites.png"
    ]
    @preloader.on "done", =>
      spritesJSON = @preloader.get "assets/sprites.json"
      spritesImage = @preloader.get "assets/sprites.png"

      @spritesAtlas = new LDFW.TextureAtlas spritesJSON.frames, spritesImage
      @screen       = new GameScreen this
      @run()
    @preloader.load()

  ###
   * Getters / setters
  ###
  getSpritesAtlas: -> return @spritesAtlas

module.exports = LD27
