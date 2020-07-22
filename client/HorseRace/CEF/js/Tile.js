class Tile 
{
	constructor(track, texture, x, y, width, height) 
	{
		this.position = {x : x, y: y}
		this.size = {width: width, height: height}
		this.track = track 
		this.updater = track.getUpdater() 
		this.texture = texture

		this.create()
	}

	create()
	{
		this.tile = $("<div/>", 
		{
			id : "Tile_" + this.texture, 
			class : "tile",
		})

		this.getTile().css("background-image", "url("  + "file/image/tiles/" + this.getTexture() + ")")

		this.getTile().css("width", this.getWidth() + "px")

		this.getTile().css("height", this.getHeight() + "px")

		this.getTile().css("left", this.getX() + "px")

		this.getTile().css("top", this.getY() + "px")

		this.getTile().appendTo($(".container"))
		
		this.getUpdater().add(this)
	}

	update()
	{

	}
	setTexture(texture)					{
											this.texture = texture
											this.getTile().css("background-image", "url("  + "file/image/tiles/" + this.getTexture() + ")")
										}

	setRepeat(repeat)					{this.getTile().css("background-repeat", repeat)}

	setBackgroundSize(width, height)	{
											this.getTile().css("background-size", width + "px " + height + "px")
										}	

	setBackgroundPosition(x, y)			{
											this.getTile().css("background-position", x + "px " + y + "px")
										}

	setPosition(x, y) 					{
											this.getTile().css("left", x + "px")
											this.getTile().css("top", y + "px")
										}
	getTile()							{return this.tile}
	getTexture()						{return this.texture}
	getUpdater()						{return this.updater}
	getWidth()							{return this.size.width}
	getHeight()							{return this.size.height}
	getX()								{return this.position.x}
	getY()								{return this.position.y}

	dispose()							{this.getTile().remove()}
}