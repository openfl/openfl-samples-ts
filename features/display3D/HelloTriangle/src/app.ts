import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import Context3D from "openfl/display3D/Context3D";
import Context3DBlendFactor from "openfl/display3D/Context3DBlendFactor";
import Context3DProgramType from "openfl/display3D/Context3DProgramType";
import Context3DVertexBufferFormat from "openfl/display3D/Context3DVertexBufferFormat";
import IndexBuffer3D from "openfl/display3D/IndexBuffer3D";
import Program3D from "openfl/display3D/Program3D";
import VertexBuffer3D from "openfl/display3D/VertexBuffer3D";
import Event from "openfl/events/Event";
import Matrix3D from "openfl/geom/Matrix3D";
import Rectangle from "openfl/geom/Rectangle";
import Vector3D from "openfl/geom/Vector3D";
import AGALMiniAssembler from "openfl/utils/AGALMiniAssembler";
import Lib from "openfl/Lib";
import Vector from "openfl/Vector";


class App extends Sprite {
	
	
	private context3D:Context3D;
	private program:Program3D;
	private vertexBuffer:VertexBuffer3D;
	private indexBuffer:IndexBuffer3D;
	
	
	constructor () {
		
		super ();
		
		this.stage.stage3Ds[0].addEventListener (Event.CONTEXT3D_CREATE, this.init);
		this.stage.stage3Ds[0].requestContext3D ();
		
	}
	
	
	private init = ():void => {
		
		this.context3D = this.stage.stage3Ds[0].context3D;
		this.context3D.configureBackBuffer (this.stage.stageWidth, this.stage.stageHeight, 1, true);
		
		this.context3D.setBlendFactors (Context3DBlendFactor.ONE, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
		
		var vertices = Vector.ofArray ([
			-0.3, -0.3, 0, 1, 0, 0,
			-0.3, 0.3, 0, 0, 1, 0,
			0.3, 0.3, 0, 0, 0, 1 ]);
		
		this.vertexBuffer = this.context3D.createVertexBuffer (3, 6);
		this.vertexBuffer.uploadFromVector (vertices, 0, 3);
		
		var indices = Vector.ofArray ([ 0, 1, 2 ]);
		
		this.indexBuffer = this.context3D.createIndexBuffer (3);
		this.indexBuffer.uploadFromVector (indices, 0, 3);
		
		var assembler = new AGALMiniAssembler ();
		
		var vertexShader = assembler.assemble (Context3DProgramType.VERTEX,
			"m44 op, va0, vc0\n" +
			"mov v0, va1"
		);
		
		var fragmentShader = assembler.assemble (Context3DProgramType.FRAGMENT,
			"mov oc, v0"
		);
		
		this.program = this.context3D.createProgram ();
		this.program.upload (vertexShader, fragmentShader);
		
		this.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	private this_onEnterFrame = (event:Event):void => {
		
		if (this.context3D == null) {
			
			return;
			
		}
		
		this.context3D.clear (1, 1, 1, 1);
		
		this.context3D.setProgram (this.program);
		this.context3D.setVertexBufferAt (0, this.vertexBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
		this.context3D.setVertexBufferAt (1, this.vertexBuffer, 3, Context3DVertexBufferFormat.FLOAT_3);
		
		var m = new Matrix3D ();
		m.appendRotation (Lib.getTimer () / 40, Vector3D.Z_AXIS);
		this.context3D.setProgramConstantsFromMatrix (Context3DProgramType.VERTEX, 0, m, true);
		
		this.context3D.drawTriangles (this.indexBuffer);
		
		this.context3D.present ();
		
	}
	
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);