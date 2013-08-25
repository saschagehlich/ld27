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

  getWrapper: -> @wrapper

  ###
   * Sets up mrdoob's stats library
  ###
  setupStats: ->
    @fpsStats = new Stats()
    @fpsStats.setMode 0

    dom = $(@fpsStats.domElement)
    dom.css
      position: "absolute"
      left: -dom.width()
      top: 0

    @wrapper.append @fpsStats.domElement

    @fpsMsStats = new Stats()
    @fpsMsStats.setMode 1
    dom = $(@fpsMsStats.domElement)
    dom.css
      position: "absolute"
      left: -dom.width()
      top: 50

    @wrapper.append @fpsMsStats.domElement

    @tickStats = new Stats()
    @tickStats.setMode 1

    dom = $(@tickStats.domElement)
    dom.css
      position: "absolute"
      left: -dom.width()
      top: 100

    @wrapper.append @tickStats.domElement

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
    delta = (Date.now() - @lastTick) / 1000
    @lastTick = Date.now()

    # If we have a screen, make it tick!
    @tickStats.begin()
    @screen?.update delta
    @tickStats.end()

    @fpsStats.begin()
    @fpsMsStats.begin()
    @clearScreen()
    @screen?.draw @context
    @fpsStats.end()
    @fpsMsStats.end()

    if @running
      requestAnimFrame @tick

module.exports = Game
