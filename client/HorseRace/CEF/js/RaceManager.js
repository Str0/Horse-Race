class RaceManager 
{
	constructor(core) 
	{
		this.core = core
		this.updater = core.getUpdater() 
		this.track = new Track(this) 
		
		this.horses = []

		this.getTrack().tuneOut()
		setTimeout(function() 
		{
			this.getTrack().tuneIn()
			
			setTimeout(function() { 
					this.getTrack().setupScene() 
					for(let i = 1; i < 7; i++)
						this.horses.push(new Horse(this, i))
					this.setupPosition()
			}.bind(this), 300)

		}.bind(this), 1000)
	}


	setupPosition() 
	{
		let height = $(".container").height(), width = $(".container").width()
		this.getHorses().forEach(element => element.setPosition(TRACK_HORSE_START_X * width, // X-Position
															(height * TRACK_HORSE_START_Y) + ((element.getNumber()-1) * element.getHeight()*.20))) //Y-Position
	}

	setStage(stage)
	{
		if (stage == STAGE_PRE_RACE) 
		{
			this.setRunning(false)
			this.getTrack().reset()
			this.getDisplay().setIconProgress(0)
			this.getHorses().forEach(element => element.reset())
			this.getDisplay().showPostScreen(false)

			HORSE_SPEED_RATIO = HORSE_SPEED_DEFAULT_RATIO
		}

		if (stage == STAGE_IN_RACE)
		{
			this.setRunning(true)
			this.getTrack().setScrollEnabled(true)
			this.getDisplay().disposePostScreen()

			HORSE_SPEED_RATIO = HORSE_SPEED_DEFAULT_RATIO
		}
	
		if (stage == STAGE_FINISH_RACE)
		{
			this.setRunning(true)
			this.getTrack().setScrollEnabled(true)
			this.getTrack().moveInFinishLine()
			this.getDisplay().disposePostScreen()

			HORSE_SPEED_RATIO = HORSE_SPEED_SPRINT_RATIO
		}

		if (stage == STAGE_POST_RACE)
		{
			this.getTrack().setScrollEnabled(false)
			this.getDisplay().showPostScreen(true)
			HORSE_SPEED_RATIO = HORSE_SPEED_SPRINT_RATIO
		}
	}

	update(stage, progress, data, length) 
	{
		if (this.getStage() !== stage)
			this.setStage(stage)


		if (stage > STAGE_PRE_RACE && stage < STAGE_POST_RACE)
		{
			if (this.getDisplay())
			{	
				if (isNaN(this.getDisplay().getIconProgress()))
					this.getDisplay().setIconProgress(progress)
			}

			this.getHorses().forEach(element => {
				if (data[element.getNumber()-1])
				{
					element.moveTo(data[element.getNumber()-1], length)
				}
			})
		}

		if (stage == STAGE_POST_RACE)
		{
			this.getDisplay().fillPostScreen(data)
		}
	}

	ensureHorseMoving()
	{
		if (!this.getHorses()[0].isMoving())
		{
			console.log("Trying to fix")
			this.setRunning(true)
		}
	}

	result(ranks) 
	{

	}
	
	setRunning(enabled)
	{
		this.running = enabled
		this.horses.forEach(element => element.setMoving(enabled))
	}

	getPositions()
	{
		let positions = []
		this.horses.forEach(element => positions.push([element.getNumber(), element.getX()]))
		positions.sort(function( a, b) { return b[1] - a[1] })
		return positions
	}

	getCore()					{return this.core}
	getUpdater()				{return this.updater}
	getDisplay()				{return this.getCore().getDisplay()}
	getTrack()					{return this.track}
	getStage()					{return this.stage}
	getHorses()					{return this.horses}
	isRunning()					{return this.running}
}