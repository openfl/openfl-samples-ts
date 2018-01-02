import Stage from "openfl/display/Stage";
import Main from "./Main";

var stage = new Stage (550, 400);
document.body.appendChild (stage.element);
stage.addChild (new Main ());