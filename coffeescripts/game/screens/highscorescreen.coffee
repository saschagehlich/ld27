BackgroundActor = require "../actors/backgroundactor.coffee"
HighscoreActor  = require "../actors/highscoreactor.coffee"
Config          = require "../config/config.json"

class HighscoreScreen extends LDFW.Screen
  constructor: (@app) ->
    super @app
    @app.getKeyboard().removeAllListeners "keydown"

    @backgroundActor = new BackgroundActor @app
    @highscoreActor  = new HighscoreActor @app

    $.getJSON Config.highscore_host + "/highscore.json?jsoncallback=?", (@scores) =>
      @highscoreActor.setScores @scores

  update: (delta) ->
    @backgroundActor.update delta
    @highscoreActor.update delta
    return

  draw: (context) ->
    context.save()
    context.fillStyle = "rgba(0, 0, 0, 0.8)"

    @backgroundActor.draw context

    context.fillRect 0, 0, @app.getWidth(), @app.getHeight()

    @highscoreActor.draw context

    context.restore()

module.exports = HighscoreScreen
