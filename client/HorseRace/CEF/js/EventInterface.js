class EventInterface
{
	constructor(core) 
	{
		this.core = core
	}

	Event_onSync(data, instant)
	{
		if (data)
		{

			let stage = parseInt(data.Stage) 

			let position = data.Positions.map(Number)

			let progress = parseInt(data.Progress)

			let length = parseInt(data.Length)

			if (typeof stage == "number" && typeof position == "object")
				this.getRaceManager().update(stage, progress, position, length, instant)
		}
	}

	getCore()				{return this.core}
	getRaceManager()		{return this.getCore().getRaceManager()}

}