ExampleActor = require "../actors/exampleactor.coffee"

class ExampleStage extends LDFW.Stage
  constructor: ->
    super

    @actor = new ExampleActor @game

  update: (delta) ->
    @actor.update delta

  draw: (context) ->
    @actor.draw context

module.exports = ExampleStage
