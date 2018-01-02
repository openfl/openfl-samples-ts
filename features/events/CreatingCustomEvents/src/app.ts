import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Event from "openfl/events/Event";
import CustomEvent from "./CustomEvent";


class App extends Sprite {
	
	
	public constructor () {
		
		super ();
		
		this.addEventListener ("simpleCustomEvent", this.this_onSimpleCustomEvent);
		this.addEventListener (CustomEvent.TYPED_CUSTOM_EVENT, this.this_onTypedCustomEvent);
		
		this.dispatchEvent (new Event ("simpleCustomEvent"));
		this.dispatchEvent (new CustomEvent (CustomEvent.TYPED_CUSTOM_EVENT, 100));
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	private this_onSimpleCustomEvent = (event:Event):void => {
		
		console.log (event);
		
	}
	
	
	private this_onTypedCustomEvent = (event:CustomEvent) => {
		
		console.log (event);
		
	}
	
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);