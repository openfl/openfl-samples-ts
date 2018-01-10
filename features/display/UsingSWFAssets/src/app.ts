import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Event from "openfl/events/Event";
import AssetLibrary from "openfl/utils/AssetLibrary";
import * as layoutPath from "./../assets/layout.swf";


class App extends Sprite {
	
	
	columnOffsetHeight:number;
	headerOffsetWidth:number;
	layout:MovieClip;
	
	
	constructor () {
		
		super ();
		
		AssetLibrary.loadFromFile (layoutPath).onComplete ((library:AssetLibrary) => {
			
			this.layout = library.getMovieClip ("Layout");
			this.addChild (this.layout);
			
			this.columnOffsetHeight = (this.layout["Column"].height - this.layout.height);
			this.headerOffsetWidth = (this.layout["Header"].width - this.layout.width);
			
			this.resize ();
			this.stage.addEventListener (Event.RESIZE, this.resize);
			
		});
		
	}
	
	
	private resize = (event:Event = null) => {
		
		var background = this.layout["Background"] as MovieClip;
		var column = this.layout["Column"] as MovieClip;
		var header = this.layout["Header"] as MovieClip;
		
		background.width = this.stage.stageWidth;
		background.height = this.stage.stageHeight;
		
		var columnHeight = this.stage.stageHeight + this.columnOffsetHeight;
		column.height = (columnHeight > 0 ? columnHeight : 0);
		
		var headerWidth = this.stage.stageWidth + this.headerOffsetWidth;
		header.width = (headerWidth > 0 ? headerWidth : 0);
		
	}
	
	
}


var stage = new Stage (0, 0, 0xFFFFFF, App);
document.body.appendChild (stage.element);