{EventEmitter} = require "events"

class Mouse extends EventEmitter
  constructor: (@app) ->
    @position = new LDFW.Vector2()
    @app.getWrapper().mousemove @onMouseMove
    @app.getWrapper().click @onClick

  onMouseMove: (e) =>
    @position.set e.offsetX, e.offsetY

  onClick: (e) =>
    @emit "click", @position

  getPosition: -> @position

module.exports = Mouse
