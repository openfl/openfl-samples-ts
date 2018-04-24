import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import BitmapDataChannel from "openfl/display/BitmapDataChannel";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import ColorTransform from "openfl/geom/ColorTransform";
import Point from "openfl/geom/Point";
import AssetLibrary from "openfl/utils/AssetLibrary";
import AssetManifest from "openfl/utils/AssetManifest";
import Assets from "openfl/utils/Assets";


class App extends Sprite {
	
	
	public constructor () {
		
		super ();
		
		var image = Assets.getBitmapData ("assets/openfl.png");
		
		var bitmap = new Bitmap (image);
		bitmap.x = 20;
		bitmap.y = 20;
		this.addChild (bitmap);
		
		var bitmap = new Bitmap (image);
		bitmap.x = 130;
		bitmap.y = 120;
		bitmap.rotation = -90;
		this.addChild (bitmap);
		
		var bitmapData = image.clone ();
		bitmapData.colorTransform (bitmapData.rect, new ColorTransform (0.5, 0, 1, 0.5, 20, 0, 0, 0));
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 240;
		bitmap.y = 20;
		this.addChild (bitmap);
		
		var bitmapData = new BitmapData (image.width, image.height);
		bitmapData.copyPixels (image, image.rect, new Point (-image.width / 2, -image.height / 2));
		bitmapData.copyPixels (image, image.rect, new Point (-image.width / 2, image.height / 2));
		bitmapData.copyPixels (image, image.rect, new Point (image.width / 2, -image.height / 2));
		bitmapData.copyPixels (image, image.rect, new Point (image.width / 2, image.height / 2));
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 350;
		bitmap.y = 20;
		this.addChild (bitmap);
		
		var bitmapData = new BitmapData (image.width, image.height, true, 0xFFEEEEEE);
		bitmapData.copyPixels (image, image.rect, new Point (), null, null, true);
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 460;
		bitmap.y = 20;
		this.addChild (bitmap);
		
		var bitmapData = image.clone ();
		bitmapData.copyChannel (image, image.rect, new Point (20, 0), BitmapDataChannel.BLUE, BitmapDataChannel.GREEN);
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 570;
		bitmap.y = 20;
		this.addChild (bitmap);
		
		var bitmapData = image.clone ();
		bitmapData.floodFill (0, 0, 0xFFEEEEEE);
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 20;
		bitmap.y = 140;
		this.addChild (bitmap);
		
		var sprite = new Sprite ();
		var bitmap = new Bitmap (image);
		bitmap.scaleX = 2;
		bitmap.alpha = 0.4;
		sprite.addChild (bitmap);
		
		var bitmapData = new BitmapData (image.width, image.height);
		bitmapData.draw (sprite);
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 130;
		bitmap.y = 140;
		this.addChild (bitmap);
		
		var bitmapData = image.clone ();
		bitmapData.scroll (image.width / 2, 0);
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 240;
		bitmap.y = 140;
		this.addChild (bitmap);
		
		var bitmapData = image.clone ();
		bitmapData.threshold (image, image.rect, new Point (40, 0), ">", 0x33000000, 0x88333333, 0xFF000000);
		var bitmap = new Bitmap (bitmapData);
		bitmap.x = 350;
		bitmap.y = 140;
		this.addChild (bitmap);
		
	}
	
	
}


var manifest = new AssetManifest ();
manifest.addBitmapData ("assets/openfl.png");

AssetLibrary.loadFromManifest (manifest).onComplete ((library) => {
	
	Assets.registerLibrary ("default", library);
	
	var stage = new Stage (670, 400, 0xFFFFFF, App);
	document.body.appendChild (stage.element);
	
}).onError ((e) => {
	
	console.log (e);
	
});