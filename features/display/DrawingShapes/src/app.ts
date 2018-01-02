import CapsStyle from "openfl/display/CapsStyle";
import Graphics from "openfl/display/Graphics";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";


class App extends Sprite {
	
	
	public constructor () {
		
		super ();
		
		var square = new Sprite ();
		square.graphics.beginFill (0x24AFC4);
		square.graphics.drawRect (0, 0, 100, 100);
		square.x = 20;
		square.y = 20;
		this.addChild (square);
		
		var rectangle = new Sprite ();
		rectangle.graphics.beginFill (0x24AFC4);
		rectangle.graphics.drawRect (0, 0, 120, 100);
		rectangle.x = 140;
		rectangle.y = 20;
		this.addChild (rectangle);
		
		var circle = new Sprite ();
		circle.graphics.beginFill (0x24AFC4);
		circle.graphics.drawCircle (50, 50, 50);
		circle.x = 280;
		circle.y = 20;
		this.addChild (circle);
		
		var ellipse = new Sprite ();
		ellipse.graphics.beginFill (0x24AFC4);
		ellipse.graphics.drawEllipse (0, 0, 120, 100);
		ellipse.x = 400;
		ellipse.y = 20;
		this.addChild (ellipse);
		
		var roundSquare = new Sprite ();
		roundSquare.graphics.beginFill (0x24AFC4);
		roundSquare.graphics.drawRoundRect (0, 0, 100, 100, 40, 40);
		roundSquare.x = 540;
		roundSquare.y = 20;
		this.addChild (roundSquare);
		
		var roundRectangle = new Sprite ();
		roundRectangle.graphics.beginFill (0x24AFC4);
		roundRectangle.graphics.drawRoundRect (0, 0, 120, 100, 40, 40);
		roundRectangle.x = 660;
		roundRectangle.y = 20;
		this.addChild (roundRectangle);
		
		var triangle = new Sprite ();
		triangle.graphics.beginFill (0x24AFC4);
		triangle.graphics.moveTo (0, 100);
		triangle.graphics.lineTo (50, 0);
		triangle.graphics.lineTo (100, 100);
		triangle.graphics.lineTo (0, 100);
		triangle.x = 20;
		triangle.y = 150;
		this.addChild (triangle);
		
		var pentagon = new Sprite ();
		pentagon.graphics.beginFill (0x24AFC4);
		this.drawPolygon (pentagon.graphics, 50, 50, 50, 5);
		pentagon.x = 145;
		pentagon.y = 150;
		this.addChild (pentagon);
		
		var hexagon = new Sprite ();
		hexagon.graphics.beginFill (0x24AFC4);
		this.drawPolygon (hexagon.graphics, 50, 50, 50, 6);
		hexagon.x = 270;
		hexagon.y = 150;
		this.addChild (hexagon);
		
		var heptagon = new Sprite ();
		heptagon.graphics.beginFill (0x24AFC4);
		this.drawPolygon (heptagon.graphics, 50, 50, 50, 7);
		heptagon.x = 395;
		heptagon.y = 150;
		this.addChild (heptagon);
		
		var octogon = new Sprite ();
		octogon.graphics.beginFill (0x24AFC4);
		this.drawPolygon (octogon.graphics, 50, 50, 50, 8);
		octogon.x = 520;
		octogon.y = 150;
		this.addChild (octogon);
		
		var decagon = new Sprite ();
		decagon.graphics.beginFill (0x24AFC4);
		this.drawPolygon (decagon.graphics, 50, 50, 50, 10);
		decagon.x = 650;
		decagon.y = 150;
		this.addChild (decagon);
		
		var line = new Sprite ();
		line.graphics.lineStyle (10, 0x24AFC4);
		line.graphics.lineTo (755, 0);
		line.x = 20;
		line.y = 280;
		this.addChild (line);
		
		var curve = new Sprite ();
		curve.graphics.lineStyle (10, 0x24AFC4);
		curve.graphics.curveTo (327.5, -50, 755, 0);
		curve.x = 20;
		curve.y = 340;
		this.addChild (curve);
		
	}
	
	
	private drawPolygon (graphics:Graphics, x:number, y:number, radius:number, sides:number):void {
		
		var step = (Math.PI * 2) / sides;
		var start = 0.5 * Math.PI;
		
		graphics.moveTo (Math.cos (start) * radius + x, -Math.sin (start) * radius + y);
		
		for (var i = 0; i < sides; i++) {
			
			graphics.lineTo (Math.cos (start + (step * i)) * radius + x, -Math.sin (start + (step * i)) * radius + y);
			
		}
		
	}
	
	
}


var stage = new Stage (650, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);