MinimapActor = require "../actors/minimapactor.coffee"
HeadlineActor = require "../actors/headlineactor.coffee"
PowerupActor = require "../actors/powerupactor.coffee"

class UIStage extends LDFW.Stage
  constructor: (@app, @game) ->
    super @game

    @minimapActor = new MinimapActor @app, @game
    @addActor @minimapActor

    @headlineActor = new HeadlineActor @app, @game
    @addActor @headlineActor

    @powerupActor = new PowerupActor @app, @game
    @addActor @powerupActor

module.exports = UIStage
