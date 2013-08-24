class Block
  availableBlocks: require "../config/available_blocks.json"
  constructor: (@app, @game, @options={}) ->
    @buildMode = @options.buildMode | false

    # Represents the block's structure
    @map = null
    @rotation = 0

    @gridPosition = new LDFW.Vector2()

    @randomize()

  randomize: ->
    index = Math.floor(Math.random() * @availableBlocks.length)
    @map = @availableBlocks[index]

  getGridPosition: -> @gridPosition
  setGridPosition: -> @gridPosition.set.apply @gridPosition, arguments

  getMap: -> @map
  getRotation: -> @rotation

module.exports = Block
