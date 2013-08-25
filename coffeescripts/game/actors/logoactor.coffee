class Char
  constructor: (@char, atlas) ->
    @sprite = atlas.createSprite("logo/#{char}.png")
    @initialY = -@sprite.getHeight()
    @toY      = 110
    @position = new LDFW.Vector2(0, @initialY)
    @sumDelta = 0
    @animDuration = 1.5
    @delay = Math.random() * 0.5

    @sprite.setPosition @position

  update: (delta) ->
    @sumDelta += delta
    return if @sumDelta < @delay

    overshoot = 1.70158

    if @sumDelta - @delay < @animDuration
      y = (@toY - @initialY)*((time=(@sumDelta - @delay)/@animDuration-1)*time*((overshoot+1)*time + overshoot) + 1) + @initialY
    else
      y = @toY

    y += Math.sin((-@sumDelta - @delay) * 4) * 5
    @position.setY y

    @sprite.setPosition @position

  draw: (context) ->
    @sprite.draw context

class LogoActor extends LDFW.Actor
  constructor: (@app) ->
    super @app

    @spritesAtlas = @app.getSpritesAtlas()

    @chars = []
    for char in "runtris"
      charObj = new Char(char, @spritesAtlas)
      @chars.push charObj

    totalWidth = 0
    for char in @chars
      totalWidth += char.sprite.getWidth() + 10

    sumWidth = 0
    for char, i in @chars
      char.position.setX @app.getWidth() / 2 - totalWidth / 2 + sumWidth
      sumWidth += char.sprite.getWidth() + 10

  update: (delta) ->
    for char in @chars
      char.update delta

  draw: (context) ->
    for char in @chars
      char.draw context

module.exports = LogoActor
