import Actuate from "motion/Actuate";
import Bitmap from "openfl/display/Bitmap";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import MouseEvent from "openfl/events/MouseEvent";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";
import Assets from "openfl/utils/Assets";


class App extends Sprite {
	
	
	private Logo:Sprite;
	private Destination:Sprite;
	
	private cacheOffsetX:number;
	private cacheOffsetY:number;
	
	
	public constructor () {
		
		super ();
		
		this.Logo = new Sprite ();
		this.Logo.addChild (new Bitmap (Assets.getBitmapData ("assets/openfl.png")));
		this.Logo.x = 100;
		this.Logo.y = 100;
		this.Logo.buttonMode = true;
		
		this.Destination = new Sprite ();
		this.Destination.graphics.beginFill (0xF5F5F5);
		this.Destination.graphics.lineStyle (1, 0xCCCCCC);
		this.Destination.graphics.drawRect (0, 0, this.Logo.width + 10, this.Logo.height + 10);
		this.Destination.x = 300;
		this.Destination.y = 95;
		
		this.addChild (this.Destination);
		this.addChild (this.Logo);
		
		this.Logo.addEventListener (MouseEvent.MOUSE_DOWN, this.Logo_onMouseDown);
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	private Logo_onMouseDown = (event:MouseEvent):void => {
		
		this.cacheOffsetX = this.Logo.x - event.stageX;
		this.cacheOffsetY = this.Logo.y - event.stageY;
		
		this.stage.addEventListener (MouseEvent.MOUSE_MOVE, this.stage_onMouseMove);
		this.stage.addEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp);
		
	}
	
	
	private stage_onMouseMove = (event:MouseEvent):void => {
		
		this.Logo.x = event.stageX + this.cacheOffsetX;
		this.Logo.y = event.stageY + this.cacheOffsetY;
		
	}
	
	
	private stage_onMouseUp = (event:MouseEvent):void => {
		
		if (this.Destination.hitTestPoint (event.stageX, event.stageY)) {
			
			Actuate.tween (this.Logo, 1, { x: this.Destination.x + 5, y: this.Destination.y + 5 } );
			
		}
		
		this.stage.removeEventListener (MouseEvent.MOUSE_MOVE, this.stage_onMouseMove);
		this.stage.removeEventListener (MouseEvent.MOUSE_UP, this.stage_onMouseUp);
		
	}
	
	
}


var manifest = new AssetManifest ();
manifest.addBitmapData ("assets/openfl.png");

AssetLibrary.loadFromManifest (manifest).onComplete ((library) => {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (550, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError ((e) => {
	
	console.error (e);
	
});