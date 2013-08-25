GameScreen      = require "./screens/gamescreen.coffee"
SplashScreen    = require "./screens/splashscreen.coffee"
HighScoreScreen = require "./screens/highscorescreen.coffee"
AboutScreen     = require "./screens/aboutscreen.coffee"
TutorialScreen  = require "./screens/tutorialscreen.coffee"
Mouse           = require "./utilities/mouse.coffee"
Keyboard        = require "./utilities/keyboard.coffee"
Config          = require "./config/config.json"

class LD27 extends LDFW.Game
  constructor: ->
    super

    @debugDiv = $("<div>").addClass("debug")
    @debugDiv.appendTo @getWrapper()

    @scoreShared = false

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
      "assets/fonts/pixel-24-white.fnt"
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
    @scoreShared = false

  switchToSplashScreen: ->
    @screen = new SplashScreen this

  switchToAboutScreen: ->
    @screen = new AboutScreen this

  switchToHighScoreScreen: ->
    @screen = new HighScoreScreen this

  switchToTutorialScreen: ->
    @screen = new TutorialScreen this

  shareScore: (score) ->
    if @scoreShared
      return alert("You already shared this score!")

    name = null
    askForName = ->
      name = prompt("Please enter your name:")
      if name isnt null and name.trim().length is 0
        alert "You didn't enter anything!"
        askForName()

    askForName()
    return if name is null

    @scoreShared = true
    name = encodeURIComponent name
    score = encodeURIComponent score

    $.getJSON Config.highscore_host + "/highscore/add.json?name=" + name + "&score=" + score + "&jsoncallback=?", (result) =>
      alert("Your score has been posted to the highscore! :)\n\nThanks for playing!")

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
