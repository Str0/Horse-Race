public static class CONSTANTS
{
	public const int AMOUNT_OF_HORSES = 6;
	public const int ROLL_COUNT = 6;
	public const int TOTAL_DURATION_OF_RACE = 5 * ROLL_COUNT;
	public const int ROLL_LENGTH = 5000; 
	public const int START_WAIT_TIME = 3000; 
	public const int MINIMUM_HORSE_POSITION = -10;
	public const int MAXIMUM_HORSE_POSITION = 55;
	public const int SPRINT_TO_END_LENGTH = 0;
	public const int FADE_IN_POST_TIME = 3000;
	public const int NO_LOBBY_IDENTIFIER = -1;
	public enum STAGES : int
	{
		PRE_RACE = 1,
		IN_RACE = 2,
		SPRINT_RACE = 3,
		POST_RACE = 4
	}
}