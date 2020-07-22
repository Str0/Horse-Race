using System;
using System.Collections.Generic;
using GTANetworkAPI;

namespace HorseRacing
{
	public class HorseRace : Script
	{
		public HorseRace()
		{
			this.clients = new List<GTANetworkAPI.Player>();
			HorseDiceRoller rollInstance = new HorseDiceRoller();
			rollInstance.race = this;
			this.roll = rollInstance;
			this.inProgress = false;
		}

		public void setupId(int businessId)
		{
			if (businessId < 0)
			{

				if (this.manager != null)
					this.id = this.manager.count;
			}
			else 
				this.id = businessId;
		}

		public void startRace() 
		{
			this.disposeTimer();
			this.inProgress = true;
			this.roll.setStage((int)CONSTANTS.STAGES.PRE_RACE);
			this.roll.initial();
			this.syncAll();
			this.timer = new util.TimerHandler(() =>{this.giveGo();}, CONSTANTS.START_WAIT_TIME);

		}

		private void giveGo() 
		{
			this.disposeTimer();
			this.roll.setStage((int)CONSTANTS.STAGES.IN_RACE); 
			this.runCount = 0;
			this.startTimestamp = this.getTimestamp();
			this.notifyAll("The race has begun!");
			this.roll.length = CONSTANTS.ROLL_LENGTH;
			this.roll.rollStart();
			this.syncAll();
			this.timer = new util.TimerHandler(() =>{this.raceLoop();}, CONSTANTS.ROLL_LENGTH);
		}

		private void raceLoop() 
		{
			this.runCount++; 
			if (this.runCount < CONSTANTS.ROLL_COUNT)
			{
				this.disposeTimer();
				this.roll.setStage((int)CONSTANTS.STAGES.IN_RACE); 
				this.roll.length = CONSTANTS.ROLL_LENGTH;
				this.roll.roll();
				this.syncAll();
				this.timer = new util.TimerHandler(() =>{this.raceLoop();}, CONSTANTS.ROLL_LENGTH);
			}
			else 
				this.sprintToEnd();
		}
		private void sprintToEnd() 
		{
			this.disposeTimer();
			this.roll.setStage((int)CONSTANTS.STAGES.SPRINT_RACE); 
			this.roll.length = CONSTANTS.SPRINT_TO_END_LENGTH;
			this.roll.finish();
			this.syncAll();
			this.timer = new util.TimerHandler(() =>{this.stopRace();}, CONSTANTS.FADE_IN_POST_TIME);
		}

		public void stopRace() 
		{
			this.disposeTimer();
			this.roll.setStage((int)CONSTANTS.STAGES.POST_RACE); 
			this.inProgress = false;
			this.roll.convertMoveArrayToRanks();
			this.syncAll(); 
		}

		public void syncAll() 
		{
			foreach(var client in this.clients)
				this.sync(client);
		}

		public void syncResults(String data) 
		{
			foreach(var client in this.clients)
				client.TriggerEvent("HorseRace:syncResults", data);
		}

		public void stopAll()
		{
			foreach(var client in this.clients)
				this.stop(client);
		}

		public void sync(GTANetworkAPI.Player client)
		{
			client.TriggerEvent("HorseRace:syncClient", this.roll.json);
		}

		public void stop(GTANetworkAPI.Player client)
		{
			client.TriggerEvent("HorseRace:stopClient");
		}

		public void addViewer(GTANetworkAPI.Player client) 
		{
			if(!this.clients.Contains(client))
			{
				NAPI.Notification.SendNotificationToPlayer(client, "~g~[Horse-Race]~s~ You are now watching Broadcast #" + this.id + "...", false);
				this.clients.Add(client);
				this.sync(client);
			}
		}

		public void removeViewer(GTANetworkAPI.Player client) 
		{
			if(this.clients.Contains(client))
			{
				NAPI.Notification.SendNotificationToPlayer(client, "~g~[Horse-Race]~s~ You have left Broadcast #" + this.id + "...", false);
				this.clients.Remove(client);
			}
		}

		public void removeAll()
		{
			foreach(var client in this.clients)
			{
				this.removeViewer(client);
			}
		}

		public void disposeTimer()
		{
			if (this.timer != null) 
				this.timer.stopTimeout();

			this.timer = null;
		}

		public void notifyAll(String text)
		{
			foreach(var client in this.clients)
				NAPI.Notification.SendNotificationToPlayer(client, "~g~[Horse-Race]~s~ " + text, false);
		}


		public long getTimestamp() 
		{
			DateTime now = DateTime.UtcNow;
			long unixTime = ((DateTimeOffset)now).ToUnixTimeSeconds();
			return unixTime;
		}


		public double getProgress()
		{
			long currentStamp = this.getTimestamp(); 
			long elapsed = currentStamp - this.startTimestamp;
			long duration = Convert.ToInt64(CONSTANTS.TOTAL_DURATION_OF_RACE);
			return ((double)elapsed / (double)duration)*100;
		}


		public bool isBusinessEmployee(Player player)
		{
			return player == player; //** REPLACE WITH BUSINESS EMPLOYEE CHECK **//
		}
		
		public int id 										{get; private set;}
		public HorseRaceManager manager						{get; set;}
		public bool inProgress								{get; private set;}
		private List<GTANetworkAPI.Player> clients			{get; set;}
		private HorseDiceRoller roll						{get; set;}
		private util.TimerHandler timer						{get; set;}
		private int	runCount								{get; set;}
		private long startTimestamp							{get; set;}
	}
}
