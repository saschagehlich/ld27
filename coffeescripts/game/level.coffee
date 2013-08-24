class Level
  constructor: (@app, @game) ->
    @scroll = new LDFW.Vector2()
    @gravity = new LDFW.Vector2(0, 450)
    @platforms = [
      {
        position: new LDFW.Vector2(10, 400)
        width: 300
      }
    ]

  update: (delta) ->
    @scroll.setX @scroll.getX() + delta * 20

  getHighestPointForPlayer: (player) ->
    maxY = @app.getHeight() * 2

    x = player.getPosition().getX()
    w = 32
    for platform in @platforms
      unless (platform.position.x > x + w or
        platform.position.x + platform.width < x)
          maxY = platform.position.y

    return maxY

  getScroll: -> @scroll
  getPlatforms: -> @platforms
  getGravity: -> @gravity

module.exports = Level
