import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import AssetLibrary from "openfl/utils/AssetLibrary";
import * as libraryPath from "./../assets/library.swf";


class App extends Sprite {
	
	
	constructor () {
		
		super ();
		
		AssetLibrary.loadFromFile (libraryPath).onComplete ((library:AssetLibrary) => {
			
			var cat = library.getMovieClip ("NyanCatAnimation");
			this.addChild (cat);
			
		}).onError (e => console.error (e));
		
	}
	
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);