import Sprite from "openfl/display/Sprite";
import Loader from "openfl/display/Loader";
import URLRequest from "openfl/net/URLRequest";
import Event from "openfl/events/Event";


export class Main extends Sprite {
	
	
	constructor () {
		
		super ();
		
		console.log (this.stage);
		
		var loader = new Loader ();
		loader.contentLoaderInfo.addEventListener (Event.COMPLETE, this.loader_onComplete);
		loader.load (new URLRequest ("openfl.png"));
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	private loader_onComplete = (event:Event) => {
		
		var bitmap = event.target.loader.content;
		bitmap.x = (this.stage.stageWidth - bitmap.width) / 2;
		bitmap.y = (this.stage.stageHeight - bitmap.height) / 2;
		this.addChild (bitmap);
		
	}
	
	
}


export default Main;