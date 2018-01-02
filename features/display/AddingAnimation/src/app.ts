import Elastic from "motion/easing/Elastic";
import Actuate from "motion/Actuate";
import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";
import Assets from "openfl/utils/Assets";


class App extends Sprite {
	
	
	public constructor () {
		
		super ();
		
		var bitmap = new Bitmap (Assets.getBitmapData ("assets/openfl.png"));
		bitmap.x = - bitmap.width / 2;
		bitmap.y = - bitmap.height / 2;
		bitmap.smoothing = true;
		
		var container = new Sprite ();
		container.addChild (bitmap);
		container.alpha = 0;
		container.scaleX = 0;
		container.scaleY = 0;
		container.x = this.stage.stageWidth / 2;
		container.y = this.stage.stageHeight / 2;
		
		this.addChild (container);
		
		Actuate.tween (container, 3, { alpha: 1 } );
		Actuate.tween (container, 6, { scaleX: 1, scaleY: 1 } ).delay (0.4).ease (Elastic.easeOut);
		
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