class Stage
  ###
   * @param  [Game] game
  ###
  constructor: (@game) ->
    @actors = []

  ###
   * Adds a new actor to the list
   * @param [Actor] actor
  ###
  addActor: (actor) ->
    @actors.push actor

  ###
   * Removes an actor from the list
   * @param  [Actor] actor
  ###
  removeActor: (actor) ->
    index = @actors.indexOf actor

    if index >= 0
      @actors.splice index, 1

  ###
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  [Number] delta
  ###
  update: (delta) ->
    for actor in @actors
      actor.update delta

  ###
   * Called after update, draw stuff here
   * @param  [CanvasRenderingContext2D] context
  ###
  draw: (context) ->
    for actor in @actors
      actor.draw context

module.exports = Stage
