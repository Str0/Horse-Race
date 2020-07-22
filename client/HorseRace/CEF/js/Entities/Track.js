class Track 
{
	constructor(race) 
	{
		this.race = race
		this.updater = race.getUpdater()
		this.setup()
		
	}

	setup() 
	{
		this.getUpdater().add(this)
	}

	tuneOut() 
	{
		if (!this.static)
		{
			this.staticOffset = 0
			this.static =  new Tile(this, "static.jpg", 0, 0, this.getContainer().width(),  this.getContainer().height())
			this.static.setBackgroundSize(this.getContainer().width(), this.getContainer().height())
			this.static.setRepeat("repeat")
			this.static.getTile().addClass("static")
		}

		if (!this.signalInfo)
		{
			this.signalInfo =  new Tile(this, "no-signal.png", 0, 0, this.getContainer().width(),  this.getContainer().height())
			this.signalInfo.setBackgroundSize(this.getContainer().width(), this.getContainer().height())
			this.signalInfo.getTile().addClass("overlay")
		}
	}

	tuneIn()
	{
		if (this.signalInfo)
		{
			this.signalInfo.setTexture("signal.png")
			this.signalInfo.getTile().fadeOut(2000)
		}

		if (this.static)
		{
			this.static.getTile().fadeOut(2000)
		}
		setTimeout(function()
		{
			if (this.signalInfo)
			{
				this.signalInfo.dispose()
				this.signalInfo = null
			}
			if (this.static)
			{
				this.static.dispose()
				this.static = null
			}
		}.bind(this), 2000)
	}

	setupScene() 
	{
		this.scene = []
		this.backgroundScroll = 0

		// SKY 
		let backgroundHeight = this.getContainer().height() * BACKGROUND_HEIGHT 
		let sky = new Tile(this, "sky.png", 0, 0, this.getContainer().width(),  backgroundHeight)
		sky.setRepeat("no-repeat")	
		sky.setBackgroundSize(this.getContainer().width(), backgroundHeight)
		sky.getTile().addClass("background")
		sky.noScroll = true
		this.scene.push(sky)

		//TREES
		let background = new Tile(this, "scene.png", 0, 0, this.getContainer().width(), backgroundHeight )
		background.setRepeat("repeat-x")	
		background.setBackgroundSize(this.getContainer().width(), backgroundHeight)

		this.scene.push(background)

		// HORSE TRACK
		let runwayHeight =  RUNWAY_HEIGHT * this.getContainer().height()
		let runway = new Tile(this, "runway.png", 0, backgroundHeight, this.getContainer().width(), runwayHeight)
		runway.setRepeat("round")		
		
		this.scene.push(runway)

		// FOREGROUND GRASS
		let foreground = new Tile(this, "scene_grass.png", 0, backgroundHeight + runwayHeight - this.getContainer().height() * FOREGROUND_HEIGHT , 
																this.getContainer().width(), this.getContainer().height() * FOREGROUND_HEIGHT )

		foreground.setRepeat("repeat-x")	
		foreground.getTile().addClass("foreground")
		foreground.setBackgroundSize(this.getContainer().width(), this.getContainer().height() * FOREGROUND_HEIGHT)
		this.scene.push(foreground)

	}

	update(delta)
	{	
		if (this.static)
		{
			this.staticOffset -= 9000;
			this.static.setBackgroundPosition(this.staticOffset, this.staticOffset)
		}
		if (this.getScene() && this.getRaceManager().isRunning())
		{

			let progress = this.getDisplay().getIconProgress()
			let newProgress = progress + HUD_ICON_PROGRESS_SPEED * this.getUpdater().getDiviation()

			if (newProgress > 100 )
				progress = 100
			else 
				progress = newProgress 

			this.getRaceManager().getCore().getDisplay().setIconProgress(progress)
			
			if (this.isScrollEnabled())
			{
				this.backgroundScroll -= Math.trunc(this.getContainer().width() * BACKGROUND_SCROLL_SPEED)  % this.getContainer().width()
				
				this.scene.forEach(element => { if (!element.noScroll) element.setBackgroundPosition(this.backgroundScroll, 0)})
				
				this.race.ensureHorseMoving() // Counter-Act Bug in which the Horse idle whilst background is scrolling
			}

			if (this.getFinishLine())
			{
				let finishLineProgress = this.getFinishLineProgress()
				let newFinishLineProgress = finishLineProgress + (this.getContainer().width() * FINISH_LINE_MOVE_IN_SPEED)
				if (newFinishLineProgress > this.getContainer().width() * FINISH_LINE_MOVE_IN_POSITION)
				{
					this.finishLineOffset = finishLineProgress 
					this.setScrollEnabled(false)
				}
				else
				{ 
					this.finishLineOffset = newFinishLineProgress
				}

				this.getFinishLine().setPosition(this.getContainer().width() - this.getFinishLineProgress(), this.getFinishLine().getY())
			}
		}
	}

	moveInFinishLine() 
	{
		if (!this.getFinishLine())
		{
			let backgroundHeight = this.getContainer().height() * BACKGROUND_HEIGHT 
			let runwayHeight =  RUNWAY_HEIGHT * this.getContainer().height()
			this.finishLineOffset = 0
			this.finishLine = new Tile(this, "flag.jpg", this.getContainer().width() - this.getFinishLineProgress(), backgroundHeight, this.getContainer().width() * FINISH_LINE_WIDTH, runwayHeight)
			this.finishLine.setRepeat("repeat")	
			this.finishLine.setBackgroundSize(this.getContainer().width()*.1, this.getContainer().width()*.1)
		}
	}

	reset()
	{
		this.setScrollEnabled(false)
		
		this.backgroundScroll -= Math.trunc(this.getContainer().width() * BACKGROUND_SCROLL_SPEED)  % this.getContainer().width()
		
		if (this.scene)
			this.scene.forEach(element => { if (!element.noScroll) element.setBackgroundPosition(this.backgroundScroll, 0)})

		if (this.getFinishLine())
		{
			this.getFinishLine().dispose() 
			this.finishLine = null
		}
	}

	setScrollEnabled(enabled) 	{this.scrollEnabled = enabled}

	getRunway()					{return this.runway}
	getUpdater()				{return this.updater}
	getContainer()				{return $(".container")}
	getDisplay()				{return this.getRaceManager().getDisplay()}
	getRaceManager()			{return this.race}
	getScene()					{return this.scene}
	isScrollEnabled()			{return this.scrollEnabled}
	getFinishLineProgress()		{return this.finishLineOffset}
	getFinishLine()				{return this.finishLine}
}