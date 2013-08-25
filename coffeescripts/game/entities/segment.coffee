class Segment
  fallingDelay: 300
  constructor: (@block, @level) ->
    @offset = new LDFW.Vector2 0, 0
    @velocity = new LDFW.Vector2()
    @falling = false
    @fallingDelayStart = 0

  update: (delta) ->
    if @falling and Date.now() - @fallingDelayStart >= @fallingDelay
      gravity = @level.getGravity().clone()
      gravityStep = gravity.multiply(delta)

      @velocity.add gravityStep
      velocityStep = @velocity.clone().multiply(delta)

      @offset.add velocityStep

  getOffset: -> @offset
  setFalling: (falling) ->
    if falling and not @falling
      @fallingDelayStart = Date.now()

    @falling = falling

module.exports = Segment
