class BackgroundActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game || @app

    @spritesAtlas = @app.getSpritesAtlas()
    @backgroundSprite = @spritesAtlas.createSprite "background.png"

    @goddamnCloudsMan = []
    for i in [0...10]
      index = Math.floor(Math.random() * 3)
      cloud = @spritesAtlas.createSprite "clouds/cloud-#{index}.png"
      cloud.setPosition(
        Math.random() * @app.getWidth() * 2,
        Math.random() * @app.getHeight() / 2
      )
      cloud.opacity = 0.05 + Math.random() * 0.03
      cloud.speedX = -Math.random() * 10
      cloud.parallaxFactor = [0.5, 0.1, 0.3][index] # URGH

      @goddamnCloudsMan.push cloud

  update: (delta) ->
    for cloud in @goddamnCloudsMan
      cloud.getPosition().add(cloud.speedX * delta * cloud.parallaxFactor, 0)

      if cloud.getPosition().getX() - (@game.getScroll?().getX() || 0) * cloud.parallaxFactor + cloud.getWidth() < 0
        cloud.setPosition(
          cloud.getPosition().getX() + @app.getWidth() + Math.random() * (@app.getWidth() * 2),
          Math.random() * @app.getHeight() / 2
        )

  draw: (context) ->
    @backgroundSprite.draw context

    context.save()

    for cloud in @goddamnCloudsMan
      context.globalAlpha = cloud.opacity
      cloud.draw context,
        cloud.getPosition().getX() - (@game.getScroll?().getX() || 0) * cloud.parallaxFactor + @game.globalRenderOffset?.getX() or 0,
        cloud.getPosition().getY() + @game.globalRenderOffset?.getY() or 0

    context.restore()

module.exports = BackgroundActor
