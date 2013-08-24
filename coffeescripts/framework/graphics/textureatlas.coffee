Sprite = require "./sprite.coffee"
TextureRegion = require "./textureregion.coffee"

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

  findRegion: (filename) ->
    unless @frames[filename]?
      throw new Error("The region #{filename} could not be found.")

    region = new TextureRegion(this, @frames[filename])
    return region

  getAtlasImage: -> @image

module.exports = TextureAtlas
