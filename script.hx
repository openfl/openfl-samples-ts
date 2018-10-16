package;


import hxp.*;
import sys.FileSystem;


class Script extends hxp.Script {
	
	
	private var samples:Array<String>;
	
	
	public function new () {
		
		super ();
		
		samples = [];
		findSamples ("", samples);
		
		samples.sort (function (a, b) {
			a = a.toLowerCase ();
			b = b.toLowerCase ();
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});
		
		switch (command) {
			
			case "list":
				
				listSamples ();
			
			case "clean":
				
				cleanSamples ();
			
			case "npm-check-updates", "check-update", "check-updates":
				
				execSamples ("ncu");
			
			default:
				
				execSamples ("npm");
			
		}
		
	}
	
	
	private function cleanSamples ():Void {
		
		var paths = [];
		
		if (commandArgs.length > 0) {
			
			var sampleName = commandArgs.shift ();
			if (sampleName == "*") sampleName = "all";
			
			for (sample in samples) {
				if (sample.split ("/").pop () == sampleName) {
					paths.push (sample);
				}
			}
			
			if (paths.length == 0 && sampleName == "all") {
				paths = samples.copy ();
			}
			
			if (paths.length == 0) {
				for (sample in samples) {
					if (StringTools.startsWith (sample, sampleName)) {
						paths.push (sample);
					}
				}
			}
			
			if (paths.length == 0) {
				Log.error ("Could not find sample name \"" + sampleName + "\"");
			}
			
		} else {
			
			paths = paths.concat (samples);
			
		}
		
		for (path in paths) {
			
			var modules = Path.combine (path, "node_modules");
			
			if (FileSystem.exists (modules)) {
				
				Log.info (Log.accentColor + "rm -r " + modules + Log.resetColor);
				System.removeDirectory (modules);
				
			}
			
		}
		
	}
	
	
	private function execSamples (script:String):Void {
		
		var paths = [];
		
		if (commandArgs.length > 0) {
			
			var sampleName = commandArgs.shift ();
			
			for (sample in samples) {
				if (sample.split ("/").pop () == sampleName) {
					paths.push (sample);
				}
			}
			
			if (paths.length == 0 && sampleName == "all") {
				paths = samples.copy ();
			}
			
			if (paths.length == 0) {
				for (sample in samples) {
					if (StringTools.startsWith (sample, sampleName)) {
						paths.push (sample);
					}
				}
			}
			
			if (paths.length == 0) {
				Log.error ("Could not find sample name \"" + sampleName + "\"");
			}
			
		} else {
			
			paths = paths.concat (samples);
			
		}
		
		for (path in paths) {
			
			var sampleName = path.split ("/").pop ();
			
			args = [ command ].concat (commandArgs);
			for (flag in flags.keys ()) {
				args.push ("-" + flag);
			}
			for (option in options.keys ()) {
				args.push (option);
			}
			args.push ("-s");
			
			Log.info (Log.accentColor + "cd " + path + " && " + script + " " + args.join (" ") + Log.resetColor);
			
			System.runCommand (path, script, args);
			
		}
		
	}
	
	
	private function findSamples (path:String, list:Array<String>):Void {
		
		if (path == "node_modules") return;
		
		for (fileName in FileSystem.readDirectory (path != "" ? path : Sys.getCwd ())) {
			
			var filePath = Path.combine (path, fileName);
			
			if (FileSystem.isDirectory (filePath)) {
				
				var match = false;
				
				for (file in [ "package.json" ]) {
					
					if (FileSystem.exists (Path.combine (filePath, file))) {
						
						list.push (Path.standardize (filePath));
						match = true;
						break;
						
					}
					
				}
				
				if (!match) findSamples (filePath, list);
				
			}
			
		}
		
	}
	
	
	private function listSamples ():Void {
		
		for (sample in samples) {
			
			var sampleName = sample.split ("/").pop ();
			Log.println (Log.accentColor + sampleName + Log.resetColor + " (" + sample + ")");
			
		}
		
	}
	
	
}