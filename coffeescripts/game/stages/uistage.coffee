MinimapActor = require "../actors/minimapactor.coffee"
HeadlineActor = require "../actors/headlineactor.coffee"
BoostActor = require "../actors/boostactor.coffee"

class UIStage extends LDFW.Stage
  constructor: (@app, @game) ->
    super @game

    @minimapActor = new MinimapActor @app, @game
    @addActor @minimapActor

    @headlineActor = new HeadlineActor @app, @game
    @addActor @headlineActor

    @boostActor = new BoostActor @app, @game
    @addActor @boostActor

module.exports = UIStage
