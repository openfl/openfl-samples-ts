import Bitmap from "openfl/display/Bitmap";
import Sprite from "openfl/display/Sprite";
import Loader from "openfl/display/Loader";
import URLRequest from "openfl/net/URLRequest";
import Event from "openfl/events/Event";
import BitmapData from "openfl/display/BitmapData";
import MouseEvent from "openfl/events/MouseEvent";
import Tilemap from "openfl/display/Tilemap";
import Tileset from "openfl/display/Tileset";
import Bunny from "./Bunny";


export class Main extends Sprite {
	
	
	private addingBunnies:boolean;
	private bunnies:Array<Bunny>;
	//private fps:FPS;
	private gravity:number;
	private minX:number;
	private minY:number;
	private maxX:number;
	private maxY:number;
	private tilemap:Tilemap;
	private tileset:Tileset;
	
	
	constructor () {
		
		super ();
		
		this.bunnies = [];
		
		this.addEventListener (Event.ADDED_TO_STAGE, () => {
			var loader = new Loader ();
			loader.contentLoaderInfo.addEventListener (Event.COMPLETE, (event) => {
				this.start ((loader.content as Bitmap).bitmapData);
			});
			loader.load (new URLRequest ("wabbit_alpha.png"));
		});
		
	}
	
	
	private start (bitmapData:BitmapData):void {
		
		this.minX = 0;
		this.maxX = this.stage.stageWidth;
		this.minY = 0;
		this.maxY = this.stage.stageHeight;
		this.gravity = 0.5;
		
		this.tileset = new Tileset (bitmapData);
		this.tileset.addRect (bitmapData.rect);
		
		this.tilemap = new Tilemap (this.stage.stageWidth, this.stage.stageHeight, this.tileset);
		//tilemap = new Tilemap (100, 100, tileset);
		this.addChild (this.tilemap);
		
		// fps = new FPS ();
		// addChild (fps);
		
		this.stage.addEventListener (MouseEvent.MOUSE_DOWN, this.stage_onMouseDown);
		this.stage.addEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp);
		this.stage.addEventListener (Event.ENTER_FRAME, this.stage_onEnterFrame);
		
		for (var i = 0; i < 10; i++) {
			
			this.addBunny ();
			
		}
		
	}
	
	
	private addBunny ():void {
		
		var bunny = new Bunny ();
		bunny.x = 0;
		bunny.y = 0;
		bunny.speedX = Math.random () * 5;
		bunny.speedY = (Math.random () * 5) - 2.5;
		this.bunnies.push (bunny);
		this.tilemap.addTile (bunny);
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	stage_onEnterFrame = (event:Event) => {
		
		for (var i = 0; i < this.bunnies.length; i++) {
			
			var bunny = this.bunnies[i];
			bunny.x += bunny.speedX;
			bunny.y += bunny.speedY;
			bunny.speedY += this.gravity;
			
			if (bunny.x > this.maxX) {
				
				bunny.speedX *= -1;
				bunny.x = this.maxX;
				
			} else if (bunny.x < this.minX) {
				
				bunny.speedX *= -1;
				bunny.x = this.minX;
				
			}
			
			if (bunny.y > this.maxY) {
				
				bunny.speedY *= -0.8;
				bunny.y = this.maxY;
				
				if (Math.random () > 0.5) {
					
					bunny.speedY -= 3 + Math.random () * 4;
					
				}
				
			} else if (bunny.y < this.minY) {
				
				bunny.speedY = 0;
				bunny.y = this.minY;
				
			}
			
		}
		
		if (this.addingBunnies) {
			
			for (var i = 0; i < 100; i++) {
				
				this.addBunny ();
				
			}
			
		}
		
	}
	
	
	private stage_onMouseDown = (event:MouseEvent) => {
		
		this.addingBunnies = true;
		
	}
	
	
	private stage_onMouseUp = (event:MouseEvent) => {
		
		this.addingBunnies = false;
		console.log (this.bunnies.length + " bunnies");
		
	}
	
	
}


export default Main;