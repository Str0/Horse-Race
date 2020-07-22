let CoreSingleton = null 

class Core 
{
	constructor() 
	{
		this.updater = new Updater()
		this.eventInterface = new EventInterface(this)
		this.raceManager = new RaceManager(this)
		this.display = new Display(this)
		this.ready = true

	}

	isReady()				{return this.ready}
	getRaceManager()		{return this.raceManager}
	getEventInterface()		{return this.eventInterface}
	getUpdater()			{return this.updater}
	getDisplay()			{return this.display}
}

$(function(){
	CoreSingleton = new Core()
})

function getCore()
{
	return CoreSingleton
}

function getEventInterface()
{
	if (getCore() && getCore().isReady()) 
		return getCore().getEventInterface()
}