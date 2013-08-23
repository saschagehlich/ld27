class Game
  constructor: (@wrapper) ->
    @context = @wrapper.find("canvas").get(0).getContext "2d"
    @running = false

    @setupStats()

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

    # If we have a screen, make it tick!
    @screen?.tick()

    @stats.end()
    if @running
      requestAnimFrame @tick

module.exports = Game
