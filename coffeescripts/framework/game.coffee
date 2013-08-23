class Game
  constructor: (@wrapper) ->
    @canvas  = @wrapper.find("canvas").get(0)
    @setSize @wrapper.width(), @wrapper.height()

    @context = @canvas.getContext "2d"
    @running = false

    @setupStats()

  clearScreen: ->
    @context.clearRect 0, 0, @canvas.width, @canvas.height

  ###
   * Sets the canvas size
  ###
  setSize: (width, height) ->
    @canvas.width  = width
    @canvas.height = height

  getWidth: -> @canvas.width
  getHeight: -> @canvas.height

  ###
   * Sets up mrdoob's stats library
  ###
  setupStats: ->
    @stats = new Stats()
    @stats.setMode 0

    @stats.domElement.style.position = "absolute"
    @stats.domElement.style.left = "0px"
    @stats.domElement.style.top = "0px"

    @wrapper.append @stats.domElement

  ###
   * Stats the game's run loop
  ###
  run: ->
    @running = true
    @lastTick = new Date()
    requestAnimFrame @tick

  ###
   * Stops / pauses the game's run loop
  ###
  stop: ->
    @running = false

  ###
   * Our main game loop
  ###
  tick: =>
    @stats.begin()

    delta = (new Date() - @lastTick) / 1000
    @clearScreen()

    # If we have a screen, make it tick!
    @screen?.update delta
    @screen?.draw @context

    @stats.end()

    @lastTick = new Date()

    if @running
      requestAnimFrame @tick

module.exports = Game
