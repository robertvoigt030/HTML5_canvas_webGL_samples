/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.2;
        var segments     = config.segments || 80;
        this.asWireframe = config.asWireframe ;
        
        window.console.log("Creating a " + (this.asWireframe? "Wireframe " : "") + 
                            "Band with radius="+radius+", height="+height+", segments="+segments ); 
    
        // generate vertex coordinates and store in an array
		//there are always two vertices more than expected************************************
        var coords = [];
        for(var i=0; i<=segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i/segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height/2;
            var y1 = -height/2;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
            
        };  
		
		var triangles = [];
		//there are always as much triangles as (vertices in coords -2) 
		for(var i = 0; i < coords.length/3; i+=2){
			triangles.push(i,i+1,i+2);
			triangles.push(i+1,i+3,i+2);
			
		}
		
		var lines = [];
		for(var i = 0; i < segments*2; i+=2){
			lines.push(i,i+1, i+1,i+3, i+3,i+2, i+2,i);
		}
		
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );
		
		if(this.asWireframe){
			this.lineBuf = new vbo.Indices(gl, {"indices": lines});
		}
		else{										  
			//element buffer to relate the vertices to triangles			
			this.triangleBuf = new vbo.Indices(gl, {"indices": triangles});
		}

    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, "vertexPosition");
		
		//draw the vertices as wireframe
		if(this.asWireframe){
			this.lineBuf.bind(gl);
			gl.drawElements(gl.LINES, this.lineBuf.numIndices(), gl.UNSIGNED_SHORT, 0);
		}
		
		else{
			this.triangleBuf.bind(gl);
			
			// draw the vertices as triangles
			//element buffer contains two more vertices then needed, thats why "...numIndices()-6" (coordinates of those two vertices)
			gl.drawElements(gl.TRIANGLES, this.triangleBuf.numIndices()-6, gl.UNSIGNED_SHORT, 0);
		}
    };
        
    // this module only returns the Band constructor function    
    return Band;

})); // define

    
