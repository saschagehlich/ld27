{EventEmitter} = require "events"

class Mouse extends EventEmitter
  constructor: (@app) ->
    @position = new LDFW.Vector2()
    @app.getWrapper().mousemove @onMouseMove
    @app.getWrapper().click @onClick
    @app.getWrapper().mousedown @onMouseDown
    @app.getWrapper().contextmenu (e) -> e.preventDefault()

  onMouseMove: (e) =>
    wrapperOffset = @app.getWrapper().position()
    @position.set(
      e.pageX - wrapperOffset.left + @app.getWidth() / 2,
      e.pageY - wrapperOffset.top + @app.getHeight() / 2
    )

  onClick: (e) =>
    @emit "click", @position

  onMouseDown: (e) =>
    if e.which is 3
      e.preventDefault()
      @emit "rightclick", @position

  getPosition: -> @position

module.exports = Mouse
