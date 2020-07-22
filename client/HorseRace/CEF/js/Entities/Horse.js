class Horse 
{
	constructor(race, number) 
	{
		this.race = race
		this.track = race.getTrack()
		this.updater = race.getUpdater()
		this.number = number
		
		this.setupHorse()
		this.setPosition(0, 0)
	}

	setupHorse() 
	{
		this.element = $("<img/>", 
		{
			id : "Horse_" + this.getNumber(), 
			class : "horse",
			src : "file/image/riders/rider_idle.png",
		})

		this.getHorse().appendTo($(".container"))

		this.shadow = $("<img/>", 
		{
			id : "HorseShadow_" + this.getNumber(), 
			class : "horseShadow",
			src : "file/image/riders/rider_idle.png", 
		})

		this.getShadow().appendTo($(".container"))

		this.setSize(this.getParent().width()* HORSE_WIDTH_PERCENTAGE, this.getParent().width() * HORSE_WIDTH_PERCENTAGE * HORSE_SIZE_RATIO)
	
		this.getUpdater().add(this)
	}


	setupInfo()
	{
		this.info = $("<div>", 
		{
			class : "horseInfo",
    		text: this.getNumber(),
		})

		this.info.horse = this

		this.info.appendTo($(".container"))
	}

	update(delta)
	{
		
		if (typeof this.target == "number")
			if (this.direction)
			{
				if (this.getX() <= this.target)
				{
					if (this.sprint)
						this.velocity = this.getSpeed() * this.getParent().width();
					
					this.setPosition(this.getX() + this.velocity)
				}
			}
			else
			{
				if (this.getX() > this.target) 
				{
					if (this.sprint)
						this.velocity = this.getSpeed() * this.getParent().width();

					this.setPosition(this.getX() - this.velocity)
				}
			}
		
		if ((this.getX() / this.getParent().width()) * 100 > 90)
		{
			this.setMoving(false)
		}
	}

	moveTo(x, time)
	{
		if (typeof time !== "number") time = 5000
		if (this.relativeX == null || this.relativeX != x)
		{
			this.relativeX = x
			this.target = this.getParent().width() * (x/100)

			if (time > 0)
			{
				this.sprint = false
				let distance = Math.abs(this.target - this.getX())
				let speedPerSecond = distance / (1000 / this.getUpdater().getTargetRate())
				let timeFactor = time / 1000 
				
				this.velocity =  (speedPerSecond / timeFactor) * this.getUpdater().getDiviation()
			}
			else 
			{
				this.sprint = true
			}

			this.direction = this.getX() < this.target
		}
	}

	reset()
	{
		this.setPosition(0, this.getY())
		this.setMoving(false)
		this.target = null;
		this.relativeX = null;
	}

	setPosition(x, y)
	{
		this.x = x
		this.y = y

		
		this.getHorse().css("left", this.getX()  + "px")
		this.getHorse().css("top",  this.getY()  + "px")

		this.getShadow().css("left", this.getX()  + "px")
		this.getShadow().css("top",  this.getY() + this.getHeight()*.6 + "px")

		//this.getInfo().css("left", (this.getX() + this.getWidth() * HORSE_INFO_OFFSET_X) + "px")
		//this.getInfo().css("top",  (this.getY() + this.getHeight() * HORSE_INFO_OFFSET_Y) + "px")
	}


	setMoving(enable)				{
										if (enable)
										{

											this.getHorse().attr("src", "file/image/riders/rider.gif")
											this.getShadow().attr("src", "file/image/riders/rider.gif")
										}
										else
										{
											this.getHorse().attr("src", "file/image/riders/rider_idle.png")
											this.getShadow().attr("src", "file/image/riders/rider_idle.png")
										}
										this.moving = enable
									}

	setSize(width, height)			{
										this.width = width 
										this.height = height
										this.getHorse().css("width", width + "px")
										this.getHorse().css("height", height + "px")
										this.getShadow().css("width", width + "px")
										this.getShadow().css("height", height + "px")
									}

	getNumber()						{return this.number}
	getUpdater()					{return this.updater}
	getWidth()						{return this.width}
	getHeight()						{return this.height}
	getX()							{return this.x}
	getY()							{return this.y}
	getParent()						{return this.getHorse().parent()}
	getHorse()						{return this.element}
	getShadow()						{return this.shadow}
	getInfo()						{return this.info}
	getEffect()						{return this.effect}
	getTrack()						{return this.track}
	isMoving()						{return this.moving}
	getSpeed()						{return this.getUpdater().getDiviation() * HORSE_SPEED_RATIO} // Take in Frame-Delta to compensate for lower speeds due to lower frames

}