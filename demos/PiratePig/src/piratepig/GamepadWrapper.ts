import GameInputControl from "openfl/ui/GameInputControl";
import GameInputDevice from "openfl/ui/GameInputDevice";


export class GamepadWrapper {
	
	
	public a:ButtonState;
	public b:ButtonState;
	public down:ButtonState;
	public device:GameInputDevice;
	public left:ButtonState;
	public right:ButtonState;
	public up:ButtonState;
	public x:ButtonState;
	public y:ButtonState;
	
	
	public constructor (device:GameInputDevice) {
		
		this.device = device;
		
		this.up = new ButtonState ();
		this.down = new ButtonState ();
		this.left = new ButtonState ();
		this.right = new ButtonState ();
		
		this.a = new ButtonState ();
		this.b = new ButtonState ();
		this.x = new ButtonState ();
		this.y = new ButtonState ();
		
	}
	
	
	public destroy ():void {
		
		this.device = null;
		
	}
	
	
	public update ():void {
		
		for (var i = 0; i < this.device.numControls; i++) {
			
			var control:GameInputControl = this.device.getControlAt (i);
			
			var state:ButtonState;
			
			switch (control.id) {
				
				case "BUTTON_11": state = this.up; break;
				case "BUTTON_12": state = this.down; break;
				case "BUTTON_13": state = this.left; break;
				case "BUTTON_14": state = this.right; break;
				case "BUTTON_0": state = this.a; break;
				case "BUTTON_1": state = this.b; break;
				case "BUTTON_2": state = this.x; break;
				case "BUTTON_3": state = this.y; break;
				
			}
			
			if (state != null) {
				
				if (control.value <= 0) {
					
					state.release ();
					
				} else {
					
					state.press ();
				}
				
			}
			
		}
		
	}
	
}


class ButtonState {
	
	
	public pressed:boolean;
	public justPressed:boolean;
	public justReleased:boolean;
	
	
	public constructor () {
		
		this.pressed = false;
		this.justPressed = false;
		this.justReleased = false;
		
	}
	
	
	public press ():void {
		
		if (!this.pressed) {
			
			this.justPressed = true;
			
		} else {
			
			this.justPressed = false;
			
		}
		
		this.pressed = true;
		this.justReleased = false;
		
	}
	
	
	public release ():void {
		
		if (this.pressed) {
			
			this.justReleased = true;
			
		} else {
			
			this.justReleased = false;
			
		}
		
		this.pressed = false;
		this.justPressed = false;
		
	}
	
	
	public update ():void {
		
		this.justPressed = false;
		this.justReleased = false;
		
	}
	
	
}


export default GamepadWrapper;