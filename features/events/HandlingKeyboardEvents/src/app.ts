import Bitmap from "openfl/display/Bitmap";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import Keyboard from "openfl/ui/Keyboard";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";
import Assets from "openfl/utils/Assets";


class App extends Sprite {
	
	
	private Logo:Sprite;
	
	private movingDown:boolean;
	private movingLeft:boolean;
	private movingRight:boolean;
	private movingUp:boolean;
	
	
	public constructor () {
		
		super ();
		
		this.Logo = new Sprite ();
		this.Logo.addChild (new Bitmap (Assets.getBitmapData ("assets/openfl.png")));
		this.Logo.x = 100;
		this.Logo.y = 100;
		this.Logo.buttonMode = true;
		this.addChild (this.Logo);
		
		this.stage.addEventListener (KeyboardEvent.KEY_DOWN, this.stage_onKeyDown);
		this.stage.addEventListener (KeyboardEvent.KEY_UP, this.stage_onKeyUp);
		this.stage.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	private stage_onKeyDown = (event:KeyboardEvent):void => {
		
		var preventDefault = true;
		
		switch (event.keyCode) {
			
			case Keyboard.DOWN: this.movingDown = true; break;
			case Keyboard.LEFT: this.movingLeft = true; break;
			case Keyboard.RIGHT: this.movingRight = true; break;
			case Keyboard.UP: this.movingUp = true; break;
			default: preventDefault = false;
			
		}
		
		if (preventDefault) event.preventDefault ();
		
	}
	
	
	private stage_onKeyUp = (event:KeyboardEvent):void => {
		
		var preventDefault = true;
		
		switch (event.keyCode) {
			
			case Keyboard.DOWN: this.movingDown = false; break;
			case Keyboard.LEFT: this.movingLeft = false; break;
			case Keyboard.RIGHT: this.movingRight = false; break;
			case Keyboard.UP: this.movingUp = false; break;
			default: preventDefault = false;
			
		}
		
		if (preventDefault) event.preventDefault ();
		
	}
	
	
	private this_onEnterFrame = (event:Event):void => {
		
		if (this.movingDown) {
			
			this.Logo.y += 5;
			
		}
		
		if (this.movingLeft) {
			
			this.Logo.x -= 5;
			
		}
		
		if (this.movingRight) {
			
			this.Logo.x += 5;
			
		}
		
		if (this.movingUp) {
			
			this.Logo.y -= 5;
			
		}
		
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