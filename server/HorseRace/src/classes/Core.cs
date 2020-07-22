using System;
using GTANetworkAPI;

namespace HorseRacing
{
	public class Core : Script
	{
		public Core()
		{
		
		}

		[ServerEvent(Event.ResourceStart)]
		public void OnResourceStart()
		{
			NAPI.Server.SetDefaultSpawnLocation(new Vector3(275.446, -1361.11, 24.5378));
			new HorseRaceManager();
		}

	}
}
