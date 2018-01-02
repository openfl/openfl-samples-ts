import Event from "openfl/events/Event";


class CustomEvent extends Event {
	
	
	public static TYPED_CUSTOM_EVENT = "typedCustomEvent";
	
	public customData:number;
	
	
	public constructor (type:string, customData:number, bubbles:boolean = false, cancelable:boolean = false) {
		
		super (type, bubbles, cancelable);
		
		this.customData = customData;
		
	}
	
	
	public clone ():Event {
		
		return new CustomEvent (this.type, this.customData, this.bubbles, this.cancelable);
		
	}
	
	
	public toString ():string {
		
		return "[CustomEvent type=\"" + this.type + "\" bubbles=" + this.bubbles + " cancelable=" + this.cancelable + " eventPhase=" + this.eventPhase + " customData=" + this.customData + "]";
		
	}
	
	
}


export default CustomEvent;