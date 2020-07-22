class Updater 
{
	constructor()
	{
		this.targetRate = 1000 / 60
		this.elements = []
		this.last = null
		this.loop()
	}

	loop()
	{
		let delta = 0
		let current = Date.now()

		if (!this.last) this.last = Date.now()
		else 
			delta = current - this.last

		this.delta = delta 
		this.elements.forEach(element => element.update(delta))
		requestAnimationFrame(this.loop.bind(this))
		this.last = current
	}

	add(element)
	{
		this.elements.push(element)
	}

	getTargetRate()			{return this.targetRate}
	getLastDelta()			{return this.delta}
	getDiviation()			{return this.getLastDelta() / this.getTargetRate()}
}