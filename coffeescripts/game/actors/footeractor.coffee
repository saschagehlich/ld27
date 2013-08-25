class BackgroundActor extends LDFW.Actor
  constructor: (@app) ->
    super @app

    @spritesAtlas = @app.getSpritesAtlas()
    @footerSprite = @spritesAtlas.createSprite "splash/footer.png"

    @initialY = @app.getHeight()
    @finalY   = @app.getHeight() - @footerSprite.getHeight()

    @setY @initialY

    @deltaSum = 0
    @animationDuration = 1

  update: (delta) ->
    @setY (@finalY - @initialY) * (-Math.pow(2,-10*@deltaSum/@animationDuration)+1)+@initialY

    @footerSprite.setPosition @position

    @deltaSum += delta
    @deltaSum = Math.min @deltaSum, @animationDuration

  draw: (context) ->
    @footerSprite.draw context

module.exports = BackgroundActor
