import BitmapData from "openfl/display/BitmapData";
import Rectangle from "openfl/geom/Rectangle";

var bitmapData = new BitmapData (200, 200, true, 0xFF24AFC4);

var rect = new Rectangle (50, 50, 100, 100);
bitmapData.fillRect (rect, 0xFFCCCCCC);

document.body.appendChild (bitmapData.image.src);
console.log ("Hello World");