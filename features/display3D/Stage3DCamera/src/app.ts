import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import Stage from "openfl/display/Stage";
import StageAlign from "openfl/display/StageAlign";
import StageScaleMode from "openfl/display/StageScaleMode";
import Texture from "openfl/display3D/textures/Texture";
import Context3D from "openfl/display3D/Context3D";
import Context3DBlendFactor from "openfl/display3D/Context3DBlendFactor";
import Context3DProgramType from "openfl/display3D/Context3DProgramType";
import Context3DTextureFormat from "openfl/display3D/Context3DTextureFormat";
import Context3DVertexBufferFormat from "openfl/display3D/Context3DVertexBufferFormat";
import IndexBuffer3D from "openfl/display3D/IndexBuffer3D";
import Program3D from "openfl/display3D/Program3D";
import VertexBuffer3D from "openfl/display3D/VertexBuffer3D";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import Matrix3D from "openfl/geom/Matrix3D";
import Rectangle from "openfl/geom/Rectangle";
import Vector3D from "openfl/geom/Vector3D";
import Keyboard from "openfl/ui/Keyboard";
import AGALMiniAssembler from "openfl/utils/AGALMiniAssembler";
import Assets from "openfl/utils/Assets";
import Timer from "openfl/utils/Timer";
import Lib from "openfl/Lib";
import Vector from "openfl/Vector";
import PerspectiveMatrix3D from "./perspectiveMatrix3D";


class App extends Sprite {
	
	
	private static DAMPING = 1.09;
	private static LINEAR_ACCELERATION = 0.0005;
	private static MAX_FORWARD_VELOCITY = 0.05;
	private static MAX_ROTATION_VELOCITY = 0.5;
	private static ROTATION_ACCELERATION = 0.01;
	
	private bitmapData:BitmapData;
	private cameraLinearAcceleration:number;
	private cameraLinearVelocity:Vector3D;
	private cameraRotationAcceleration:number;
	private cameraRotationVelocity:number;
	private cameraWorldTransform:Matrix3D;
	private context3D:Context3D;
	private indexBuffer:IndexBuffer3D; 
	private program:Program3D;
	private projectionTransform:PerspectiveMatrix3D;
	private texture:Texture;
	private vertexbuffer:VertexBuffer3D;
	private viewTransform:Matrix3D;
	
	
	constructor () {
		
		super ();
		
		this.stage.stage3Ds[0].addEventListener (Event.CONTEXT3D_CREATE, this.stage3D_onContext3DCreate);
		this.stage.stage3Ds[0].requestContext3D ();
		
		this.stage.scaleMode = StageScaleMode.NO_SCALE;
		this.stage.align = StageAlign.TOP_LEFT;
		
		this.addEventListener (Event.ENTER_FRAME, this.this_onEnterFrame);
		
		this.stage.addEventListener (KeyboardEvent.KEY_DOWN, this.stage_onKeyDown);
		this.stage.addEventListener (KeyboardEvent.KEY_UP, this.stage_onKeyUp);
		
	}
	
	
	private calculateUpdatedVelocity (curVelocity:number, curAcceleration:number, maxVelocity:number):number {
		
		var newVelocity;
		
		if (curAcceleration != 0) {
			
			newVelocity = curVelocity + curAcceleration;
			
			if (newVelocity > maxVelocity) {
				
				newVelocity = maxVelocity;
				
			} else if (newVelocity < -maxVelocity) {
				
				newVelocity = - maxVelocity;
				
			}
			
		} else {
			
			newVelocity = curVelocity / App.DAMPING;
			
		}
		
		return newVelocity;
		
	}
	
	
	private initialize ():void {
		
		this.context3D = stage.stage3Ds[0].context3D;
		
		this.context3D.configureBackBuffer (550, 400, 1, true);
		
		var vertices = Vector.ofArray ([
			-0.3, -0.3, 0, 0, 0,
			-0.3, 0.3, 0, 0, 1,
			0.3, 0.3, 0, 1, 1,
			0.3, -0.3, 0, 1, 0 ]);
		
		this.vertexbuffer = this.context3D.createVertexBuffer (4, 5);
		this.vertexbuffer.uploadFromVector (vertices, 0, 4);
		
		this.indexBuffer = this.context3D.createIndexBuffer (6);
		this.indexBuffer.uploadFromVector (Vector.ofArray ([ 0, 1, 2, 2, 3, 0 ]), 0, 6);
		
		this.texture = this.context3D.createTexture (this.bitmapData.width, this.bitmapData.height, Context3DTextureFormat.BGRA, false);
		this.texture.uploadFromBitmapData (this.bitmapData);
		
		var vertexShaderAssembler  = new AGALMiniAssembler ();
		vertexShaderAssembler.assemble (Context3DProgramType.VERTEX,
			"m44 op, va0, vc0\n" +
			"mov v0, va1"
		);
		
		var fragmentShaderAssembler = new AGALMiniAssembler ();
		fragmentShaderAssembler.assemble (Context3DProgramType.FRAGMENT,
			"tex ft1, v0, fs0 <2d,linear,nomip>\n" +
			"mov oc, ft1"
		);
		
		this.program = this.context3D.createProgram ();
		this.program.upload (vertexShaderAssembler.agalcode, fragmentShaderAssembler.agalcode);
		
		this.cameraWorldTransform = new Matrix3D ();
		this.cameraWorldTransform.appendTranslation (0, 0, -2);
		this.viewTransform = new Matrix3D ();
		this.viewTransform = this.cameraWorldTransform.clone ();
		this.viewTransform.invert ();
		
		this.cameraLinearVelocity = new Vector3D ();
		this.cameraRotationVelocity = 0;
		
		this.cameraLinearAcceleration = 0;
		this.cameraRotationAcceleration = 0;
		
		this.projectionTransform = new PerspectiveMatrix3D ();
		
		var aspect = 4 / 3;
		var zNear = 0.1;
		var zFar = 1000;
		var fov = 45 * Math.PI / 180;
		
		this.projectionTransform.perspectiveFieldOfViewLH (fov, aspect, zNear, zFar);
		
	}
	
	
	private render ():void {
		
		if (this.context3D == null) {
			
			return;
			
		}
		
		this.context3D.clear (1, 1, 1, 1);
		this.context3D.setBlendFactors (Context3DBlendFactor.ONE, Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA);
		
		this.context3D.setVertexBufferAt (0, this.vertexbuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
		this.context3D.setVertexBufferAt (1, this.vertexbuffer, 3, Context3DVertexBufferFormat.FLOAT_2);
		
		this.context3D.setTextureAt (0, this.texture);
		this.context3D.setProgram (this.program);
		
		this.updateViewMatrix ();
		
		var matrix = new Matrix3D ();
		matrix.appendRotation (Lib.getTimer () / 30, Vector3D.Y_AXIS);
		matrix.appendRotation (Lib.getTimer () / 10, Vector3D.X_AXIS);
		matrix.appendTranslation (0, 0, -1);
		matrix.append (this.viewTransform);
		matrix.append (this.projectionTransform);
		
		this.context3D.setProgramConstantsFromMatrix (Context3DProgramType.VERTEX, 0, matrix, true);
		
		this.context3D.drawTriangles (this.indexBuffer);
		this.context3D.present ();
		
	}
	
	
	private updateViewMatrix ():void {
		
		this.cameraLinearVelocity.z = this.calculateUpdatedVelocity (this.cameraLinearVelocity.z, this.cameraLinearAcceleration, App.MAX_FORWARD_VELOCITY);
		this.cameraRotationVelocity = this.calculateUpdatedVelocity (this.cameraRotationVelocity, this.cameraRotationAcceleration, App.MAX_ROTATION_VELOCITY); 
		
		this.cameraWorldTransform.appendRotation (this.cameraRotationVelocity, Vector3D.Y_AXIS, this.cameraWorldTransform.position);
		this.cameraWorldTransform.position = this.cameraWorldTransform.transformVector (this.cameraLinearVelocity);
		
		this.viewTransform.copyFrom (this.cameraWorldTransform);
		this.viewTransform.invert ();
		
	}
	
	
	
	
	// Event Handlers
	
	
	
	
	private stage_onKeyDown = (event:KeyboardEvent):void => {
		
		switch (event.keyCode) {
			
			case Keyboard.LEFT:
				
				this.cameraRotationAcceleration = -App.ROTATION_ACCELERATION;
				break;
			
			case Keyboard.UP:
				
				this.cameraLinearAcceleration = App.LINEAR_ACCELERATION;
				break;
			
			case Keyboard.RIGHT:
				
				this.cameraRotationAcceleration = App.ROTATION_ACCELERATION;
				break;
			
			case Keyboard.DOWN:
				
				this.cameraLinearAcceleration = -App.LINEAR_ACCELERATION;
				break;
			
		}
		
	}
	
	
	private stage_onKeyUp = (event:KeyboardEvent):void => {
		
		switch (event.keyCode) {
			
			case Keyboard.LEFT:
			case Keyboard.RIGHT:
				
				this.cameraRotationAcceleration = 0;
				break;
			
			case Keyboard.UP:
			case Keyboard.DOWN:
				
				this.cameraLinearAcceleration = 0;
				break;
			
			
		}
		
	}
	
	
	private stage3D_onContext3DCreate = (event:Event):void => {
		
		BitmapData.loadFromFile ("openfl.png").onComplete ((bitmapData) => {
			
			this.bitmapData = bitmapData;
			
			this.initialize ();
			
		}).onError ((e) => {
			
			console.error (e);
			
		});
		
	}
	
	
	private this_onEnterFrame = (event:Event):void => {
		
		this.render ();
		
	}
	
	
}


var stage = new Stage (550, 400, 0xFFFFFF, App);
document.body.appendChild (stage.element);