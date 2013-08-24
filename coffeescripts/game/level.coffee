class Level
  constructor: (@app, @game) ->
    @scroll = new LDFW.Vector2()
    @gravity = 8
    @platforms = [
      {
        position: new LDFW.Vector2(10, 400)
        width: 300
      }
    ]

  update: (delta) -> return

  getScroll: -> @scroll
  getPlatforms: -> @platforms
  getGravity: -> @gravity

module.exports = Level
