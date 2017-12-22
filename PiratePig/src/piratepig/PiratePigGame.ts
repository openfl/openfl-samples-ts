import Quad from "motion/easing/Quad";
import Actuate from "motion/Actuate";
import Bitmap from "openfl/display/Bitmap";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import BlurFilter from "openfl/filters/BlurFilter";
import DropShadowFilter from "openfl/filters/DropShadowFilter";
import Point from "openfl/geom/Point";
import Sound from "openfl/media/Sound";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";
import TextFormatAlign from "openfl/text/TextFormatAlign";
import Assets from "openfl/utils/Assets";
import Lib from "openfl/Lib";
import GamepadWrapper from "./GamepadWrapper";
import Tile from "./Tile";

// #if (!flash || enable_gamepad_support)
import GameInputEvent from "openfl/events/GameInputEvent";
import GameInput from "openfl/ui/GameInput";
import GameInputDevice from "openfl/ui/GameInputDevice";
import GameInputControl from "openfl/ui/GameInputControl";
// #end


export class PiratePigGame extends Sprite {
	
	
	private static NUM_COLUMNS = 8;
	private static NUM_ROWS = 8;
	
	private static tileImages = [ "images/game_bear.png", "images/game_bunny_02.png", "images/game_carrot.png", "images/game_lemon.png", "images/game_panda.png", "images/game_piratePig.png" ];
	
	private Background:Sprite;
	private Cursor:Bitmap;
	private CursorHighlight:Bitmap;
	private IntroSound:Sound;
	private Logo:Bitmap;
	private Score:TextField;
	private Sound3:Sound;
	private Sound4:Sound;
	private Sound5:Sound;
	private TileContainer:Sprite;
	
	public currentScale:number;
	public currentScore:number;
	
	private cacheMouse:Point;
	private cursorPosition:Point;
	private gamepads:Array<GamepadWrapper>;
	private needToCheckMatches:boolean;
	private selectedTile:Tile;
	private tiles:Array<Array<Tile>>;
	private usedTiles:Array<Tile>;
	
	// #if (!flash || enable_gamepad_support)
	private gameInput:GameInput;
	// #end
	
	
	public constructor () {
		
		super ();
		
		this.initialize ();
		this.construct ();
		
		this.newGame ();
		
	}
	
	
	private addTile (row:number, column:number, animate:boolean = true):void {
		
		var tile = null;
		var type = Math.round (Math.random () * (PiratePigGame.tileImages.length - 1));
		
		for (var usedTile of this.usedTiles) {
			
			if (usedTile.removed && usedTile.parent == null && usedTile.type == type) {
				
				tile = usedTile;
				
			}
			
		}
		
		if (tile == null) {
			
			tile = new Tile (PiratePigGame.tileImages[type]);
			
		}
		
		tile.initialize ();
		
		tile.type = type;
		tile.row = row;
		tile.column = column;
		this.tiles[row][column] = tile;
		
		var position = this.getPosition (row, column);
		
		if (animate) {
			
			var firstPosition = this.getPosition (-1, column);
			
			tile.alpha = 0;
			tile.x = firstPosition.x;
			tile.y = firstPosition.y;
			
			tile.moveTo (0.15 * (row + 1), position.x, position.y);
			Actuate.tween (tile, 0.3, { alpha: 1 } ).delay (0.15 * (row - 2)).ease (Quad.easeOut);
			
		} else {
			
			tile.x = position.x;
			tile.y = position.y;
			
		}
		
		this.TileContainer.addChild (tile);
		this.needToCheckMatches = true;
		
	}
	
	
	private construct ():void {
		
		this.Logo.smoothing = true;
		this.addChild (this.Logo);
		
		var font = Assets.getFont ("fonts/FreebooterUpdated.ttf");
		var defaultFormat = new TextFormat (font.fontName, 60, 0x000000);
		defaultFormat.align = TextFormatAlign.RIGHT;
		
		var contentWidth = 75 * PiratePigGame.NUM_COLUMNS;
		
		this.Score.x = contentWidth - 200;
		this.Score.width = 200;
		this.Score.y = 12;
		this.Score.selectable = false;
		this.Score.defaultTextFormat = defaultFormat;
		
		//Score.filters = [ new BlurFilter (1.5, 1.5), new DropShadowFilter (1, 45, 0, 0.2, 5, 5) ];
		
		this.Score.embedFonts = true;
		this.addChild (this.Score);
		
		this.Background.y = 85;
		this.Background.graphics.beginFill (0xFFFFFF, 0.4);
		this.Background.graphics.drawRect (0, 0, contentWidth, 75 * PiratePigGame.NUM_ROWS);
		
		//Background.filters = [ new BlurFilter (10, 10) ];
		this.addChild (this.Background);
		
		this.TileContainer.x = 14;
		this.TileContainer.y = this.Background.y + 14;
		this.TileContainer.addEventListener (MouseEvent.MOUSE_DOWN, this.TileContainer_onMouseDown);
		Lib.current.stage.addEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp);
		this.addChild (this.TileContainer);
		
		this.IntroSound = Assets.getSound ("soundTheme");
		this.Sound3 = Assets.getSound ("sound3");
		this.Sound4 = Assets.getSound ("sound4");
		this.Sound5 = Assets.getSound ("sound5");
		
		this.Cursor.x = this.TileContainer.x;
		this.Cursor.y = this.TileContainer.y;
		this.CursorHighlight.x = this.Cursor.x;
		this.CursorHighlight.y = this.Cursor.y;
		
		this.Cursor.visible = false;
		this.CursorHighlight.visible = false;
		
		this.addChild (this.Cursor);
		this.addChild (this.CursorHighlight);
		
		// #if (!flash || enable_gamepad_support)
		this.gameInput = new GameInput ();
		this.gameInput.addEventListener (GameInputEvent.DEVICE_ADDED, this.gameInput_onDeviceAdded);
		this.gameInput.addEventListener (GameInputEvent.DEVICE_REMOVED, this.gameInput_onDeviceRemoved);
		// #end
		
	}
	
	
	private dropTiles ():void {
		
		for (var column = 0; column < PiratePigGame.NUM_COLUMNS; column++) {
			
			var spaces = 0;
			
			for (var row = 0; row < PiratePigGame.NUM_ROWS; row++) {
				
				var index = (PiratePigGame.NUM_ROWS - 1) - row;
				var tile = this.tiles[index][column];
				
				if (tile == null) {
					
					spaces++;
					
				} else {
					
					if (spaces > 0) {
						
						var position = this.getPosition (index + spaces, column);
						tile.moveTo (0.15 * spaces, position.x,position.y);
						
						tile.row = index + spaces;
						this.tiles[index + spaces][column] = tile;
						this.tiles[index][column] = null;
						
						this.needToCheckMatches = true;
						
					}
					
				}
				
			}
			
			for (var i = 0; i < spaces; i++) {
				
				var row = (spaces - 1) - i;
				this.addTile (row, column);
				
			}
			
		}
		
	}
	
	
	private findMatches (byRow:boolean, accumulateScore:boolean = true):Array<Tile> {
		
		var matchedTiles = new Array <Tile> ();
		
		var max:number;
		var secondMax:number;
		
		if (byRow) {
			
			max = PiratePigGame.NUM_ROWS;
			secondMax = PiratePigGame.NUM_COLUMNS;
			
		} else {
			
			max = PiratePigGame.NUM_COLUMNS;
			secondMax = PiratePigGame.NUM_ROWS;
			
		}
		
		for (var index = 0; index < max; index++) {
			
			var matches = 0;
			var foundTiles = new Array <Tile> ();
			var previousType = -1;
			
			for (var secondIndex = 0; secondIndex < secondMax; secondIndex++) {
				
				var tile:Tile;
				
				if (byRow) {
					
					tile = this.tiles[index][secondIndex];
					
				} else {
					
					tile = this.tiles[secondIndex][index];
					
				}
				
				if (tile != null && !tile.moving) {
					
					if (previousType == -1) {
						
						previousType = tile.type;
						foundTiles.push (tile);
						continue;
						
					} else if (tile.type == previousType) {
						
						foundTiles.push (tile);
						matches++;
						
					}
					
				}
				
				if (tile == null || tile.moving || tile.type != previousType || secondIndex == secondMax - 1) {
					
					if (matches >= 2 && previousType != -1) {
						
						if (accumulateScore) {
							
							if (matches > 3) {
								
								this.Sound5.play ();
								
							} else if (matches > 2) {
								
								this.Sound4.play ();
								
							} else {
								
								this.Sound3.play ();
								
							}
							
							this.currentScore += Math.pow (matches, 2) * 50;
							
						}
						
						matchedTiles = matchedTiles.concat (foundTiles);
						
					}
					
					matches = 0;
					foundTiles = new Array <Tile> ();
					
					if (tile == null || tile.moving) {
						
						this.needToCheckMatches = true;
						previousType = -1;
						
					} else {
						
						previousType = tile.type;
						foundTiles.push (tile);
						
					}
					
				}
				
			}
			
		}
		
		return matchedTiles;
		
	}
	
	
	private getPosition (row:number, column:number):Point {
		
		return new Point (column * (57 + 16), row * (57 + 16));
		
	}
	
	
	private initialize ():void {
		
		this.currentScale = 1;
		this.currentScore = 0;
		
		this.tiles = new Array <Array <Tile>> ();
		this.usedTiles = new Array <Tile> ();
		this.gamepads = new Array ();
		
		for (var row = 0; row < PiratePigGame.NUM_ROWS; row++) {
			
			this.tiles[row] = new Array <Tile> ();
			
			for (var column = 0; column < PiratePigGame.NUM_COLUMNS; column++) {
				
				this.tiles[row][column] = null;
				
			}
			
		}
		
		this.Background = new Sprite ();
		this.Logo = new Bitmap (Assets.getBitmapData ("images/logo.png"));
		this.Score = new TextField ();
		this.TileContainer = new Sprite ();
		this.Cursor = new Bitmap (Assets.getBitmapData ("images/cursor.png"));
		this.CursorHighlight = new Bitmap (Assets.getBitmapData ("images/cursor_highlight.png"));
		
	}
	
	
	private moveCursor (x:number, y:number, aPressed:boolean):void {
		
		if (this.cursorPosition == null) this.cursorPosition = new Point();
		
		var oldTile = this.tiles[this.cursorPosition.y][this.cursorPosition.x];
		
		this.cursorPosition.x += x;
		this.cursorPosition.y += y;
		
		if (this.cursorPosition.y > this.tiles.length - 1) this.cursorPosition.y = this.tiles.length - 1;
		if (this.cursorPosition.x > this.tiles[0].length - 1) this.cursorPosition.x = this.tiles[0].length - 1;
		if (this.cursorPosition.y < 0) this.cursorPosition.y = 0;
		if (this.cursorPosition.x < 0) this.cursorPosition.x = 0;
		
		var tile = this.tiles[this.cursorPosition.y][this.cursorPosition.x];
		
		if (tile != null) {
			
			this.Cursor.x = this.TileContainer.x + tile.x;
			this.Cursor.y = this.TileContainer.y + tile.y;
			this.CursorHighlight.x = this.Cursor.x;
			this.CursorHighlight.y = this.Cursor.y;
			
			if (aPressed && oldTile != tile && oldTile != null) {
				
				this.swapTile (oldTile, this.cursorPosition.y, this.cursorPosition.x);
				
			}
			
		}
		
	}
	
	
	public newGame ():void {
		
		this.currentScore = 0;
		this.Score.text = "0";
		
		for (var row = 0; row < PiratePigGame.NUM_ROWS; row++) {
			
			for (var column = 0; column < PiratePigGame.NUM_COLUMNS; column++) {
				
				this.removeTile (row, column, false);
				
			}
			
		}
		
		for (row = 0; row < PiratePigGame.NUM_ROWS; row++) {
			
			for (column = 0; column < PiratePigGame.NUM_COLUMNS; column++) {
				
				this.addTile (row, column, false);
				
			}
			
		}
		
		this.IntroSound.play ();
		
		// TODO
		//removeEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		//addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		Lib.current.removeEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		Lib.current.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		
	}
	
	
	public removeTile (row:number, column:number, animate:boolean = true):void {
		
		var tile = this.tiles[row][column];
		
		if (tile != null) {
			
			tile.remove (animate);
			this.usedTiles.push (tile);
			
		}
		
		this.tiles[row][column] = null;
		
	}
	
	
	public resize (newWidth:number, newHeight:number):void {
		
		var maxWidth = newWidth * 0.90;
		var maxHeight = newHeight * 0.86;
		
		this.currentScale = 1;
		this.scaleX = 1;
		this.scaleY = 1;
		
		var currentWidth = this.width;
		var currentHeight = this.height;
		
		if (currentWidth > maxWidth || currentHeight > maxHeight) {
			
			var maxScaleX = maxWidth / currentWidth;
			var maxScaleY = maxHeight / currentHeight;
			
			if (maxScaleX < maxScaleY) {
				
				this.currentScale = maxScaleX;
				
			} else {
				
				this.currentScale = maxScaleY;
				
			}
			
			this.scaleX = this.currentScale;
			this.scaleY = this.currentScale;
			
		}
		
		this.x = newWidth / 2 - (currentWidth * this.currentScale) / 2;
		
	}
	
	
	private swapTile (tile:Tile, targetRow:number, targetColumn:number):void {
		
		if (targetColumn >= 0 && targetColumn < PiratePigGame.NUM_COLUMNS && targetRow >= 0 && targetRow < PiratePigGame.NUM_ROWS) {
			
			var targetTile = this.tiles[targetRow][targetColumn];
			
			if (targetTile != null && !targetTile.moving) {
				
				this.tiles[targetRow][targetColumn] = tile;
				this.tiles[tile.row][tile.column] = targetTile;
				
				if (this.findMatches (true, false).length > 0 || this.findMatches (false, false).length > 0) {
					
					targetTile.row = tile.row;
					targetTile.column = tile.column;
					tile.row = targetRow;
					tile.column = targetColumn;
					var targetTilePosition = this.getPosition (targetTile.row, targetTile.column);
					var tilePosition = this.getPosition (tile.row, tile.column);
					
					targetTile.moveTo (0.3, targetTilePosition.x, targetTilePosition.y);
					tile.moveTo (0.3, tilePosition.x, tilePosition.y);
					
					this.needToCheckMatches = true;
					
				} else {
					
					this.tiles[targetRow][targetColumn] = targetTile;
					this.tiles[tile.row][tile.column] = tile;
					
				}
				
			}
			
		}
		
	}
	
	
	private updateGamepadInput ():void {
		
	// 	#if (!flash || enable_gamepad_support)
		
		for (var gamepad of this.gamepads) {
			
			gamepad.update ();
			
		}
		
		if (this.gamepads.length > 0) {
			
			var aPressed = this.gamepads[0].a.pressed;
			
			if (this.gamepads[0].up.justPressed) {
				
				this.moveCursor (0, -1, aPressed);
				
			} else if (this.gamepads[0].down.justPressed) {
				
				this.moveCursor(0, 1, aPressed);
				
			} else if (this.gamepads[0].left.justPressed) {
				
				this.moveCursor( -1, 0, aPressed);
				
			} else if (this.gamepads[0].right.justPressed) {
				
				this.moveCursor(1, 0, aPressed);
				
			}
			
			this.Cursor.visible = !aPressed;
			this.CursorHighlight.visible = aPressed;
			
		} else {
			
			this.Cursor.visible = false;
			this.CursorHighlight.visible = false;
			
		}
		
	// 	#end
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	
	// #if (!flash || enable_gamepad_support)
	
	private gameInput_onDeviceAdded = (event:GameInputEvent):void => {
		
		var device = event.device;
		device.enabled = true;
		
		this.gamepads.push (new GamepadWrapper (device));
		
	}
	
	
	private gameInput_onDeviceRemoved = (event:GameInputEvent):void => {
		
		var device = event.device;
		device.enabled = false;
		
		for (var gamepad of this.gamepads) {
			
			if (gamepad.device == device) {
				
				gamepad.destroy ();
				
				var index = this.gamepads.indexOf (gamepad);
				if (index > -1) this.gamepads.splice (index, 1);
				return;
				
			}
			
		}
		
	}
	
	// #end
	
	
	private stage_onMouseUp = (event:MouseEvent):void => {
		
		if (this.cacheMouse != null && this.selectedTile != null && !this.selectedTile.moving) {
			
			var differenceX = event.stageX - this.cacheMouse.x;
			var differenceY = event.stageY - this.cacheMouse.y;
			
			if (Math.abs (differenceX) > 10 || Math.abs (differenceY) > 10) {
				
				var swapToRow = this.selectedTile.row;
				var swapToColumn = this.selectedTile.column;
				
				if (Math.abs (differenceX) > Math.abs (differenceY)) {
					
					if (differenceX < 0) {
						
						swapToColumn --;
						
					} else {
						
						swapToColumn ++;
						
					}
					
				} else {
					
					if (differenceY < 0) {
						
						swapToRow --;
						
					} else {
						
						swapToRow ++;
						
					}
					
				}
				
				this.swapTile (this.selectedTile, swapToRow, swapToColumn);
				
			}
			
		}
		
		this.selectedTile = null;
		this.cacheMouse = null;
		
	}
	
	
	private this_onEnterFrame = (event:Event):void => {
		
		this.updateGamepadInput ();
		
		if (this.needToCheckMatches) {
			
			var matchedTiles = new Array<Tile> ();
			
			matchedTiles = matchedTiles.concat (this.findMatches (true));
			matchedTiles = matchedTiles.concat (this.findMatches (false));
			
			for (var tile of matchedTiles) {
				
				this.removeTile (tile.row, tile.column);
				
			}
			
			if (matchedTiles.length > 0) {
				
				this.Score.text = String (this.currentScore);
				this.dropTiles ();
				
			}
			
		}
		
	}
	
	
	private TileContainer_onMouseDown = (event:MouseEvent):void => {
		
		if (event.target instanceof Tile) {
			
			this.selectedTile = event.target;
			this.cacheMouse = new Point (event.stageX, event.stageY);
			
		} else {
			
			this.cacheMouse = null;
			this.selectedTile = null;
			
		}
		
	}
	
	
}


export default PiratePigGame;