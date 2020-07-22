using System;
using System.Linq;
using System.Collections.Generic;
using GTANetworkAPI;

namespace HorseRacing
{
	public class HorseDiceRoller : Script
	{
		private class JSONRoll 
		{
			public string Stage; 
			public string[] Positions; 
			public string Progress;
			public string Length;
		}

		public HorseDiceRoller()
		{
			this.random = new Random();
			this.stage = 0; 
			this.moveArray = new int[6];
		}

		public void initial()
		{
			for (int i = 0; i < CONSTANTS.AMOUNT_OF_HORSES; i++)
				this.moveArray[i] = 0;
				
			this.progression = 0;
			this.json = this.getJSON();
		}

		public void roll()
		{
			for (int i = 0; i < CONSTANTS.AMOUNT_OF_HORSES; i++)
			{
				if (random.Next(0, 4) >= 1)
					this.moveArray[i] = random.Next(CONSTANTS.MINIMUM_HORSE_POSITION, CONSTANTS.MAXIMUM_HORSE_POSITION);
			}

			this.progression = (int)this.race.getProgress();
			this.json = this.getJSON();
		}

		public void rollStart() 
		{
			for (int i = 0; i < CONSTANTS.AMOUNT_OF_HORSES; i++)
				this.moveArray[i] = random.Next(30, CONSTANTS.MAXIMUM_HORSE_POSITION);

			this.progression = (int)this.race.getProgress();
			this.json = this.getJSON();
		}

		public void finish()
		{
			this.winOrder = this.getRanks();
			for (int i = 0; i < CONSTANTS.AMOUNT_OF_HORSES; i++)
				this.moveArray[i] = 90;

			this.progression = (int)this.race.getProgress();
			this.json = this.getJSON();
		}

		public void convertMoveArrayToRanks()
		{
			for (int i = 0; i < CONSTANTS.AMOUNT_OF_HORSES; i++)
				this.moveArray[i] = this.winOrder[i];
				
			this.json = this.getJSON();
		}

		public void setStage(int stage) 
		{
			this.stage = stage;
		}
		
		public string getJSON() 
		{
			JSONRoll js = new JSONRoll();
			js.Stage = this.stage.ToString();
			js.Progress = this.progression.ToString();
			js.Positions = Array.ConvertAll(this.moveArray, e=> e.ToString()); 
			js.Length = this.length.ToString();
			return NAPI.Util.ToJson(js);
		}

		public int[] getRanks()
		{
			List<int[]> temporary = new List<int[]>();

			for (int i = 0; i < CONSTANTS.AMOUNT_OF_HORSES; i++) 
				temporary.Add(new int[]{i+1, this.moveArray[i]});

			return temporary.OrderByDescending(o=>o[1]).Select(o => o[0]).ToArray();
		}

		public HorseRace race					{get; set;}
		private Random random					{get; set;}
		private int[] winOrder					{get; set;}
		public String json						{get; private set;}
		public int[] moveArray					{get; private set;}
		public int stage						{get; private set;}
		public int length						{get; set;}
		private int progression					{get; set;}
	}
}
