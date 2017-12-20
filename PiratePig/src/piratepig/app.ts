import Application from "openfl/display/Application";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Sound from "openfl/media/Sound";
import Font from "openfl/text/Font";
import AssetLibrary from "openfl/utils/AssetLibrary";
import Assets from "openfl/utils/Assets";
import PiratePig from "./PiratePig";


class Main extends Sprite {
	
	
	public constructor () {
		
		super ();
		
		// TODO: Add support for asset manifests
		
		var images = [
			{ path: "images/background_tile.png" },
			{ path: "images/center_bottom.png" },
			{ path: "images/cursor_highlight.png" },
			{ path: "images/cursor.png" },
			{ path: "images/game_bear.png" },
			{ path: "images/game_bunny_02.png" },
			{ path: "images/game_carrot.png" },
			{ path: "images/game_lemon.png" },
			{ path: "images/game_panda.png" },
			{ path: "images/game_piratePig.png" },
			{ path: "images/logo.png" }
		];
		
		var sounds = [
			{ paths: [ "sounds/3.ogg", "sounds/3.mp3", "sounds/3.wav" ], id: "sound3" },
			{ paths: [ "sounds/4.ogg", "sounds/4.mp3", "sounds/4.wav" ], id: "sound4" },
			{ paths: [ "sounds/5.ogg", "sounds/5.mp3", "sounds/5.wav" ], id: "sound5" },
			{ paths: [ "sounds/theme.ogg", "sounds/theme.mp3", "sounds/theme.wav" ], id: "soundTheme" }
		];
		
		var fonts = [
			{ name: "Freebooter", id: "fonts/FreebooterUpdated.ttf" }
		];
		
		// Hack, since the default asset library (usually) always exists
		var library = new AssetLibrary ();
		Assets.registerLibrary ("default", library);
		
		var total = images.length + sounds.length + fonts.length;
		var loaded = 0;
		
		var checkLoaded = () => {
			
			loaded++;
			if (loaded == total) {
				this.addChild (new PiratePig ());
			}
			
		}
		
		for (let imageAsset of images) {
			
			BitmapData.loadFromFile (imageAsset.path).onComplete ((bitmapData) => {
				
				Assets.cache.setBitmapData (imageAsset.path, bitmapData);
				checkLoaded ();
				
			}).onError (function (e) {
				console.error (e);
			});
			
		}
		
		for (let soundAsset of sounds) {
			
			Sound.loadFromFiles (soundAsset.paths).onComplete ((sound) => {
				
				Assets.cache.setSound (soundAsset.id, sound);
				checkLoaded ();
				
			}).onError ((e) => {
				console.error (e);
			});
			
		}
		
		for (let fontAsset of fonts) {
			
			Font.loadFromName (fontAsset.name).onComplete ((font) => {
				
				Assets.cache.setFont (fontAsset.id, font);
				checkLoaded ();
				
			}).onError (function (e) {
				console.error (e);
			});
			
		}
		
	}
	
	
}


var app = new Application ();
app.create ({
	windows: [{
		width: 0,
		height: 0,
		element: window.document.getElementById ("openfl-content"),
		resizable: true
	}]
});
app.exec ();

var stage = app.window.stage;
stage.addChild (new Main ());