class PostScreen 
{
	constructor(core) 
	{
		this.core = core 
		this.updater = core.getUpdater()
		this.setup()
	}

	setup() 
	{
		this.getUpdater().add(this)
	}

	fadeIn()
	{
		if (!this.isActive())
		{
			this.displayContainer = $("<div/>", 
			{
				id : "postScreen", 
				class : "postScreen",
			})

			this.width = this.getContainer().width()
			this.height = this.getContainer().height()

			this.getDisplay().css("width", this.getWidth() + "px")
			this.getDisplay().css("height", this.getHeight() + "px")
			this.getDisplay().css("left", 0 + "px")
			this.getDisplay().css("top", 0 + "px")
			this.getDisplay().appendTo(this.getContainer())
			this.getDisplay().addClass("postFadeIn")

		
			let infoBackground = $("<div/>", 
			{
				id : "infoBackground", 
				class : "infoBackground",
			})

			infoBackground.css("width", this.getWidth() * 1  + "px")
			infoBackground.css("height", this.getHeight() * .125 + "px")
			infoBackground.css("left", 0 + "px")
			infoBackground.css("top", this.getHeight() * .05 + "px")
			infoBackground.addClass("postFadeIn")
			infoBackground.appendTo(this.getDisplay())

			let info = $("<div/>", 
			{
				id : "infoText", 
				class : "infoText",
			})

			info.css("width", this.getWidth()  + "px")
			info.css("height", this.getHeight() * .125 + "px")

			info.css({
				"position" : "absolute",
				"left" : "50%",
				"top" : "50%",
				"margin-left" : -info.outerWidth()/2,
				"margin-top" : -info.outerHeight()/2.5
			})
			info.css("font-size", this.getHeight() * .1 + "px")
			info.css("line-height", this.getHeight() * .125 + "px")
			info.text("RESULTS OF LAST RACE")
			info.addClass("postFadeIn")
			info.appendTo(infoBackground)


	
		}
	}

	fadeOut()
	{
		if (this.isActive())
		{
			this.getDisplay().css("animation", "fadeOut 1s ease-in-out 1 forwards")
			setTimeout(function (){
				this.dispose()
			}.bind(this), HUD_POST_SCREEN_FADE_TIME)
			
		}
	}

	fill(data)
	{
		this.rows = []
		this.rowTimers =[]
		data.forEach((entry, index) => 
		{
			this.rowTimers.push(setTimeout(function(){
				let place = this.createPlace(index+1, .2, .25 + (HUD_POST_SCREEN_ROW_HEIGHT * index + index * .025), .2, HUD_POST_SCREEN_ROW_HEIGHT)
				place.addClass("postFadeIn")
				this.rows.push(place)

				let row = this.createRow(entry, .42, .25 + (HUD_POST_SCREEN_ROW_HEIGHT * index + index * .025), .4, HUD_POST_SCREEN_ROW_HEIGHT)
				row.addClass("postFadeIn")
				this.rows.push(row)
			}.bind(this), (HUD_POST_SCREEN_FADE_TIME/2) * (index+1)))
		})
	}

	clear()
	{
		if (this.rowTimers)
			this.rowTimers.forEach(element => clearTimeout(element))

		if (this.rows) 
			this.rows.forEach(element => element.remove())

		this.rows = null
		this.rowTimers = null
	}

	createPlace(rank, x, y, width, height)
	{
		let row = $("<div/>", 
		{
			id : "rankRow", 
			class : "rankRow",
		})

		row.css("width",+ this.getWidth()* width + "px")
		row.css("height",+ this.getHeight() * height + "px")
		row.css("left", this.getWidth() * x + "px")
		row.css("top", this.getHeight() * y + "px")


		let node = $("<div/>", 
		{
			id : "rankText", 
			class : "rankText",
		})

		node.css("width",+ this.getWidth()* width + "px")
		node.css("height",+ this.getHeight() * height + "px")
		node.css("line-height", row.height() + "px")
		node.css("font-size", row.height() + "px")
		node.html(POSITION_NAMES[rank])

		node.css({
			"position" : "absolute",
			"left" : "50%",
			"top" : "50%",
			"margin-left" : -node.outerWidth()/2,
			"margin-top" : -node.outerHeight()/2.5
		})

		node.appendTo(row)

		row.appendTo(this.getDisplay())
		return row
	}

	createRow(content, x, y, width, height)
	{
		let row = $("<div/>", 
		{
			id : "rankRow", 
			class : "rankRow",
		})

		row.css("width",+ this.getWidth()* width + "px")
		row.css("height",+ this.getHeight() * height + "px")
		row.css("left", this.getWidth() * x + "px")
		row.css("top", this.getHeight() * y + "px")


		let node = $("<div/>", 
		{
			id : "rankText", 
			class : "rankText",
		})

		node.css("width",+ this.getWidth()* width + "px")
		node.css("height",+ this.getHeight() * height + "px")
		node.css("line-height", row.height() + "px")
		node.css("font-size", row.height() + "px")
		node.text(HORSE_NAMES[content])
		node.addClass("glow" + HORSE_NAMES[content])

		node.css({
			"position" : "absolute",
			"left" : "50%",
			"top" : "50%",
			"margin-left" : -node.outerWidth()/2,
			"margin-top" : -node.outerHeight()/2.5
		})

		node.appendTo(row)

		row.appendTo(this.getDisplay())
		return row
	}

	update(delta) 
	{

	}
	
	dispose() 
	{
		if(this.isActive())
		{
			this.clear()
			this.getDisplay().remove()
			this.displayContainer = null
		}
	}

	getUpdater()		{return this.updater}
	getContainer()		{return $(".container")}
	getWidth()			{return this.width}
	getHeight()			{return this.height}
	getDisplay()		{return this.displayContainer}
	isActive()			{return this.getDisplay()}
}