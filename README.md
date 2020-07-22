#Horse-Race System

## Integration Notes
The Method 

`public bool isBusinessEmployee(Player player)` 

needs to be adjusted to reflect which player owns a casino-business. It currently returns true, meaning that any player can start a race.

The Id of a Horse-Race Instance needs to be the according Business-Id within the GTA:W-Script.

`public void createLobby(int businessId);`


In addition to that, the entity-data:

`player.SetData("HorseRace:Lobby", ...);` 

Needs to be set to that Business-Id whenever the player enters the business, so he is marked to be inside such a business for the Horse-Race System.

## Structure

##Client

####CEF
- index.html 
> HTML file which contains the containers for the horse-race.

- panel.html 
> HTML file which contains the containers for the menu to start or spectate the horse-race.

- Core.js 
>Initialises the CEF-Classes

- Constants.js 
>Contains all constants for the race, such as the positions of the background-sprites and speed-factors.

- RaceManager.js 
>Manages all Race Entities such as Track and Horses, places these entities and receives updates for these entities from the EventInterface.

- EventInterface.js 
>Communicates between CEF and Client to pass in Stage-Updates

- Tile.js 
>Creates 2D Sprites by taking in position and a texture

- Updater.js 
>Handles Frame-Updates and keeps track of Framedeltas.

- Updater.js 
>Handles Frame-Updates and keeps track of Framedeltas.

- Entities/Horse.js 
>Horse-Class which manages the 2D-Sprite and the state of each Horse.

- Entities/Track.js 
>Track-Class which manages the 2D-Sprites of the Background and the endless scrolling of them. Note that the Background consists of several layers to create a parallax effect.

- HUD/Display.js 
>HUD which displays the race progress on the top center.

- HUD/PostScreen.js 
>HUD which displays the race results in a list at the end of the race.

####Client
- index.js
> Contains Event-Handles for updating the panel and the horse-race. The inputs received from the server are a JSON-String which entails information abouth the progress (0-100%) of the race and the destination position to which each horse should move to.


------------


##Server
- Core.cs
> Initializes the HorseRaceManager

- Constants.cs 
> Static Class, that contains Enums for the stages and other constants used throughout the System. 

- HorseRaceManager.cs
> Singleton-like Class which contains all HorseRace-Instances. It furthermore handles every remote-event/command and forwards it to the HorseRace-Instance by finding the correct one through the Lobby-Id. 

- HorseRace.cs 
> Individual Race-Instance, managing the race state and containing a list of spectators. In addition to that, it handles the sync to each client (Happens every five seconds the race is running). It loops through the race stages and uses the HorseDiceRoller-Class to determine each Horses position.

- HorseDiceRoll.cs 
> Contains all logic for the Horse-Position Determination as well as fixed states such as the finishing phase in which all horses should move to the end from the current position they are at.  It also contains a sub-class JSONRoll which is just an object containing String-Properties that will be serialized to a JSON-String and send to each client.

- TimerHandler.cs 
> Utility-Class to help with setting up Timers for the Stage-Loop that happens every five seconds.