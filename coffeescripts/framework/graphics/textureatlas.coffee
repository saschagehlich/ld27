Sprite = require "./sprite.coffee"

class TextureAtlas
  constructor: (@frames, @image) -> return

  ###
   * Creates a new Sprite object from the given filename
   * @param  [String] filename
   * @return [Sprite]
  ###
  createSprite: (filename) ->
    unless @frames[filename]?
      throw new Error("The sprite #{filename} could not be found.")

    sprite = new Sprite(this, @frames[filename])
    return sprite

  getAtlasImage: -> @image

module.exports = TextureAtlas
