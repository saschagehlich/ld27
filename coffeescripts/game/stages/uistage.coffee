MinimapActor = require "../actors/minimapactor.coffee"
HeadlineActor = require "../actors/headlineactor.coffee"
PowerupActor = require "../actors/powerupactor.coffee"
TimerActor = require "../actors/timeractor.coffee"

class UIStage extends LDFW.Stage
  constructor: (@app, @game) ->
    super @game

    @minimapActor = new MinimapActor @app, @game
    @addActor @minimapActor

    @headlineActor = new HeadlineActor @app, @game
    @addActor @headlineActor

    @timerActor = new TimerActor @app, @game
    @addActor @timerActor

  draw: (context) ->
    @minimapActor.draw context
    @headlineActor.draw context
    unless @game.isOver()
      @timerActor.draw context

module.exports = UIStage
