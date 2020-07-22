class Display 
{
	constructor(core) 
	{
		this.core = core 
		this.updater = core.getUpdater()
		this.postScreen = new PostScreen(this.core)
		this.setupContainer()
		this.setupClose()
	}

	setupContainer() 
	{
		this.displayContainer = $("<div/>", 
		{
			id : "displayContainer", 
			class : "displayContainer",
		})

		this.width = this.getContainer().width()  * HUD_TOP_WIDTH
		this.height = this.getContainer().height() * HUD_TOP_HEIGHT

		this.getDisplay().css("width",+ this.getWidth() + "px")
		this.getDisplay().css("height",+ this.getHeight() + "px")
		this.getDisplay().css("left", (this.getContainer().width() * .5 - this.getWidth() * .5) + "px")
		this.getDisplay().css("top", (this.getContainer().height() * .05) + "px")
		this.setupProgress()
		this.getDisplay().appendTo(this.getContainer())
		this.getUpdater().add(this)
	}

	setupClose() 
	{
		this.closeButton = $("<div/>", 
		{
			class : "closeButton",
		})
		
		let offset = this.getContainer().offset()
		this.closeButton.css("width", this.getWidth() * .05 + "px")
		this.closeButton.css("height", this.getWidth() * .05 + "px")
		this.closeButton.css("margin-left", (offset.left + this.getContainer().outerWidth()) - this.getWidth() * .05 + "px")
		this.closeButton.css("margin-top", offset.top - (this.closeButton.outerHeight() * .5) + "px")
		this.closeButton.css("line-height", this.closeButton.outerHeight() + "px")
		this.closeButton.css("font-size", this.closeButton.outerHeight() + "px")

		this.closeButton.html("&times;")
		this.closeButton.appendTo($("body"))

		this.closeButton.click(() => 
		{
			if(typeof mp !== "undefined" && mp.trigger)
				mp.trigger("HorseRace:Event_onClientCloseCEF", "Main")
		})
	}

	setupProgress() 
	{
		this.progressLine = []

		this.progressLine.push(this.createLine(.01, .44, .015, .12, "point"))

		this.progressLine.push(this.createLine(.015, .5, .97, .01, "line"))

		this.progressLine.push(this.createLine(.98, .2, .01, .6, "dashed"))

		this.horseIcon = $("<img/>", 
		{
			id : "horseIcon", 
			class : "horseIcon rotateHorseIcon",
			src: "file/image/tiles/horse.png"
		})

		this.horseIcon.css("width",+ this.getWidth() * .05 + "px")
		this.horseIcon.css("height",+ this.getWidth() * .05 + "px")
		this.horseIcon.css("left", (this.getWidth() * .01) + "px")
		this.horseIcon.css("top", (this.getHeight() * .5) - this.getWidth() * .025 + "px")
		this.horseIcon.left = this.getWidth() * .01;
		this.horseIcon.appendTo(this.getDisplay())
	
	}

	
	createLine(x, y, width, height, classOf="line") 
	{	

		let heightAbs = this.getHeight() * height
		if (heightAbs < 1) heightAbs = 1

		let line = $("<div/>", 
		{
			id : "line", 
			class : classOf,
		})

		line.css("width",+ this.getWidth()* width + "px")
		line.css("height", heightAbs + "px")
		line.css("left", this.getWidth() * x + "px")
		line.css("top", this.getHeight() * y + "px")
		line.appendTo(this.getDisplay())
		return line
	}

	setIconProgress(progress)
	{

		this.progress = progress
		this.getHorseIcon().left = this.getWidth() * .01 + ((this.getWidth() - (this.getWidth() * .06)) * (progress/100))
		this.getHorseIcon().css("left",  this.getHorseIcon().left)
	}


	showPostScreen(show)
	{
		if (show)
			this.postScreen.fadeIn()
		else
			this.postScreen.fadeOut() 
	}

	fillPostScreen(data)
	{
		this.postScreen.fill(data)
	}

	disposePostScreen()
	{
		if (this.postScreen.isActive())
			this.postScreen.dispose()
	}

	update(delta) 
	{

	}

	getUpdater()		{return this.updater}
	getContainer()		{return $(".container")}
	getWidth()			{return this.width}
	getHeight()			{return this.height}
	getDisplay()		{return this.displayContainer}
	getHorseIcon()		{return this.horseIcon}
	getIconProgress()	{return this.progress}
}