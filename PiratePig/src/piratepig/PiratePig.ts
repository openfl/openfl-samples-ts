import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import Capabilities from "openfl/system/Capabilities";
import Assets from "openfl/utils/Assets";
import Lib from "openfl/Lib";
import PiratePigGame from "./PiratePigGame";


export class PiratePig extends Sprite {
	
	
	private Background:Bitmap;
	private Footer:Bitmap;
	private Game:PiratePigGame; 
	
	
	public constructor () {
		
		super ();
		
		this.addEventListener (Event.ADDED_TO_STAGE, (_) => {
			
			this.initialize ();
			this.construct ();
			
			this.resize (this.stage.stageWidth, this.stage.stageHeight);
			this.stage.addEventListener (Event.RESIZE, this.stage_onResize);
			
		});
		
	}
	
	
	private construct ():void {
		
		this.Footer.smoothing = true;
		
		this.addChild (this.Background);
		this.addChild (this.Footer);
		this.addChild (this.Game);
		
	}
	
	
	private initialize ():void {
		
		this.Background = new Bitmap (Assets.getBitmapData ("images/background_tile.png"));
		this.Footer = new Bitmap (Assets.getBitmapData ("images/center_bottom.png"));
		this.Game = new PiratePigGame ();
		
	}
	
	
	private resize (newWidth:number, newHeight:number):void {
		
		this.Background.width = newWidth;
		this.Background.height = newHeight;
		
		this.Game.resize (newWidth, newHeight);
		
		this.Footer.scaleX = this.Game.currentScale;
		this.Footer.scaleY = this.Game.currentScale;
		this.Footer.x = newWidth / 2 - this.Footer.width / 2;
		this.Footer.y = newHeight - this.Footer.height;
		
	}
	
	
	private stage_onResize = (event:Event):void => {
		
		this.resize (this.stage.stageWidth, this.stage.stageHeight);
		
	}
	
	
}


export default PiratePig;