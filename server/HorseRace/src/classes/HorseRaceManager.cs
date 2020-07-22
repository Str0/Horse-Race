using System;
using System.Collections.Generic;
using GTANetworkAPI;

namespace HorseRacing
{
	public class HorseRaceManager : Script
	{
		public HorseRaceManager()
		{
			
			this.count = 0;
			this.lobbies = new List<HorseRace>();
			this.createLobby(1);
			this.createLobby(2);
		}

		public void createLobby(int businessId)
		{
			this.count++;
			HorseRace raceLobby = new HorseRace();
			raceLobby.manager = this;
			raceLobby.setupId(businessId);
			this.lobbies.Add(raceLobby);
		}

		[RemoteEvent("HorseRace:onClientLeave")]
		public void Event_onClientLeave(Player spectator)
		{
			int clientLobby = spectator.GetData<int>("HorseRace:Lobby");
			if (this.lobbies.Exists(lobby => lobby.id == clientLobby))
			{
				this.lobbies.Find(lobby => lobby.id == clientLobby).removeViewer(spectator);
			}
		}

		[ServerEvent(Event.PlayerDisconnected)]
		public void Event_onClientDisconnect(Player player)
		{
			int clientLobby = player.GetData<int>("HorseRace:Lobby");
			if (this.lobbies.Exists(lobby => lobby.id == clientLobby))
			{
				this.lobbies.Find(lobby => lobby.id == clientLobby).removeViewer(player);
			}
		}

		[Command("enter")]
		public void CMD_enterBusiness(Player player, int id)
		{
			player.SendChatMessage("You have simulated entering Business " + id);
			player.SetData("HorseRace:Lobby", id);
		}

		[Command("quit")]
		public void CMD_quitBusiness(Player player, int id)
		{
			player.SetData("HorseRace:Lobby", CONSTANTS.NO_LOBBY_IDENTIFIER);
		}

		[Command("race")]
		public void Event_OnClientRequestPanel(Player player)
		{
			int lobbyId = player.GetData<int>("HorseRace:Lobby");
			if (lobbyId != CONSTANTS.NO_LOBBY_IDENTIFIER)
			{
				HorseRace lobbyInstance = this.lobbies.Find(lobby => lobby.id == lobbyId);
				if (lobbyInstance != null)
					player.TriggerEvent("HorseRace:openPanel", lobbyInstance.isBusinessEmployee(player) ? "owner" : "casual", lobbyInstance.inProgress);
			}
		}

		[RemoteEvent("HorseRace:onClientRequestSpectate")]
		public void Event_OnClientSpectate(Player player)
		{
			int lobbyId = player.GetData<int>("HorseRace:Lobby");
			if (this.lobbies.Exists(lobby => lobby.id == lobbyId))
			{
				this.lobbies.Find(lobby => lobby.id == lobbyId).addViewer(player);
			}
		}

		[RemoteEvent("HorseRace:onClientRequestStart")]
		public void Event_OnClientStartRace(Player player)
		{
			int lobbyId = player.GetData<int>("HorseRace:Lobby");
			if (this.lobbies.Exists(lobby => lobby.id == lobbyId))
			{
				player.SendNotification("~g~[Horse-Race]~s~ You have started the Race!");
				this.lobbies.Find(lobby => lobby.id == lobbyId).startRace();
			}
		}

		/**
		[Command("end")]
		public void CMD_stopLobby(Player player, int id)
		{
			if (this.lobbies.Exists(lobby => lobby.id == id))
				this.lobbies.Find(lobby => lobby.id == id).stopRace();
		}
		*/

		public int count									{get; private set;}
		
		private List<HorseRace> lobbies						{get; set;}
		private Core core									{get; set;}
	}
}
