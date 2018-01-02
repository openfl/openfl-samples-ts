import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Font from "openfl/text/Font";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";


class App extends Sprite {
	
	
	public constructor () {
		
		super ();
		
		var format = new TextFormat ("Katamotz Ikasi", 30, 0x7A0026);
		var textField = new TextField ();
		
		textField.defaultTextFormat = format;
		textField.embedFonts = true;
		textField.selectable = false;
		
		textField.x = 50;
		textField.y = 50;
		textField.width = 200;
		
		textField.text = "Hello World";
		
		this.addChild (textField);
		
	}
	
	
}


var manifest = new AssetManifest ();
manifest.addFont ("Katamotz Ikasi");

AssetLibrary.loadFromManifest (manifest).onComplete ((library) => {
	
	//Assets.registerLibrary ("default", library);
	
	var stage = new Stage (550, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError ((e) => {
	
	console.error (e);
	
});