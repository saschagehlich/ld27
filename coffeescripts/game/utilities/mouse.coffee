class Mouse
  constructor: (@app) ->
    @position = new LDFW.Vector2()
    @app.getWrapper().mousemove @onMouseMove

  onMouseMove: (e) =>
    @position.set e.offsetX, e.offsetY

  getPosition: -> @position

module.exports = Mouse
