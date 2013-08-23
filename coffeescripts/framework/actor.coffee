Node = require "./node.coffee"

class Actor extends Node
  ###
   * @param  [Game] game
  ###
  constructor: (@game) ->
    super

  ###
   * Called at the beginning of every tick, update properties and do
   * calculations in here
   * @param  [Number] delta
  ###
  update: (delta) ->
    return

  ###
   * Called after update, draw stuff here
   * @param  [CanvasRenderingContext2D] context
  ###
  draw: (context) ->
    return

module.exports = Actor
