let CEF_RACE = null
let CEF_PANEL = null
let LAST_SYNC_RACE_PACKET = null
let LAST_SYNC_PANEL_PACKET = null
let LAST_SYNC_PANEL_PACKET_STATE = null 

mp.events.add("HorseRace:syncClient", (data) => 
{
	if (typeof data == "string")
	{
		LAST_SYNC_RACE_PACKET = data
		if (!mp.objects.exists(CEF_RACE))
		{
			return setupCEF("Main")
		}
		CEF_RACE.execute(`getEventInterface().Event_onSync(${data})`)
	}
})


mp.events.add("HorseRace:openPanel", (panelType, raceState) => 
{
	LAST_SYNC_PANEL_PACKET = panelType
	LAST_SYNC_PANEL_PACKET_STATE = raceState
	if (!mp.objects.exists(CEF_PANEL))
	{
		return setupCEF("Panel")
	}
	CEF_PANEL.execute(`Event_onUpdate("${panelType}", ${raceState})`)
})

mp.events.add("HorseRace:syncResults", (data) => 
{
	if (typeof data == "string")
	{
		if (mp.objects.exists(CEF_RACE))
		{
			CEF_RACE.execute(`getEventInterface().Event_onShowResult(${data})`)
		}
	}
})

mp.events.add("HorseRace:stopClient", () => 
{
	if (mp.objects.exists(CEF_RACE))
		CEF_RACE.destroy()

	CEF_RACE = null
})


mp.events.add("HorseRace:Event_onCEFBrowserReady", (browserType) => 
{
	if (browserType === "Main")
		if (LAST_SYNC_RACE_PACKET)
			CEF_RACE.execute(`getEventInterface().Event_onSync(${LAST_SYNC_RACE_PACKET})`)
	else 
		if (LAST_SYNC_PANEL_PACKET)
		{
			CEF_PANEL.execute('Event_onUpdate("' + LAST_SYNC_PANEL_PACKET  + '", ' + LAST_SYNC_PANEL_PACKET_STATE.toString() + ' )')
		}
})

mp.events.add('browserDomReady', (browser) => {
	if (browser == CEF_RACE)
	{
		if (LAST_SYNC_RACE_PACKET)
			CEF_RACE.execute(`getEventInterface().Event_onSync(${LAST_SYNC_RACE_PACKET})`)
	}
	else 
	{
		if (LAST_SYNC_PANEL_PACKET)
			CEF_PANEL.execute('Event_onUpdate("' + LAST_SYNC_PANEL_PACKET  + '", ' + LAST_SYNC_PANEL_PACKET_STATE.toString() + ' )')
	}
})

mp.events.add("HorseRace:Event_onClientCloseCEF", (browserType) => 
{
	if (browserType === "Main")
	{
		mp.events.callRemote("HorseRace:onClientLeave");

		if (mp.objects.exists(CEF_RACE))
			CEF_RACE.destroy()
		CEF_RACE = null
	}
	else 
	{
		if (mp.objects.exists(CEF_PANEL))
			CEF_PANEL.destroy()
		CEF_PANEL = null
	}
})

mp.events.add("HorseRace:Event_onPanelAction", (action) => 
{
	if (action == "Spectate") 
		mp.events.callRemote("HorseRace:onClientRequestSpectate")
	else 
		mp.events.callRemote("HorseRace:onClientRequestStart")
})


function setupCEF(browserType) 
{
	if(browserType === "Main")
		CEF_RACE = mp.browsers.new('package://HorseRace/CEF/index.html')
	else 
		CEF_PANEL = mp.browsers.new('package://HorseRace/CEF/panel.html')
}
