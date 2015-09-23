/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Cube
 *
 * The Cube is centered in the origin, all sides are axis-aligned, 
 * and each edge has length 1. 
 *
 *                   H              G
 *                   .--------------.
 *                  /              /|
 *                 / |            / |
 *                /              /  |
 *              D/   |         C/   |
 *    y         .--------------.    |
 *    |         |    |         |    |
 *    |         |    .- - - - -|----.
 *    |         |    E         |   /F
 *    0-----x   |  /           |  /
 *   /          |              | /
 *  /           |/             |/
 * z            .--------------.  
 *              A              B
 *
 *
 * We use a right-handed coordinate system with Z pointing towards the 
 * viewer. For example, vertex A (front bottom left) has the coordinates  
 * ( x = -0.5, y = -0.5, z = 0.5 ) . 
 *
 * The cube only consists of eight different vertex positions; however 
 * for various reasons (e.g. different normal directions) these vertices
 * are "cloned" for each face of the cube. There will be 3 instances
 * of each vertex, since each vertex belongs to three different faces.
 *
 */


/* requireJS module definition */
define(["util", "vbo"], 
       (function(Util, vbo) {
       
    "use strict";
    
    // constructor, takes WebGL context object as argument
    var Cube = function(gl) {
    
        
        window.console.log("Creating a unit Cube."); 
    
        // generate points and store in an array
        var coords = [ 
                       // front
                       -0.5, -0.5,  0.5,  // A: index 0
                        0.5, -0.5,  0.5,  // B: index 1
                        0.5,  0.5,  0.5,  // C: index 2
                       -0.5,  0.5,  0.5,  // D: index 3
                       
                       // back
                       -0.5, -0.5, -0.5,  // E: index 4
                        0.5, -0.5, -0.5,  // F: index 5
                        0.5,  0.5, -0.5,  // G: index 6
                       -0.5,  0.5, -0.5,  // H: index 7
                       
                       // left
                       -0.5, -0.5,  0.5,  // A': index 8
                       -0.5,  0.5,  0.5,  // D': index 9
                       -0.5,  0.5, -0.5,  // H': index 10
                       -0.5, -0.5, -0.5,  // E': index 11
                       
                       // right
                        0.5, -0.5,  0.5,  // B': index 12
                        0.5, -0.5, -0.5,  // F': index 13
                        0.5,  0.5, -0.5,  // G': index 14
                        0.5,  0.5,  0.5,  // C': index 15
                       
                       // top
                       -0.5,  0.5,  0.5,  // D'': index 16
                        0.5,  0.5,  0.5,  // C'': index 17
                        0.5,  0.5, -0.5,  // G'': index 18
                       -0.5,  0.5, -0.5,  // H'': index 19

                       // bottom
                       -0.5, -0.5,  0.5,  // A'': index 20
                       -0.5, -0.5, -0.5,  // E'': index 21
                        0.5, -0.5, -0.5,  // F'': index 22
                        0.5, -0.5,  0.5   // B'': index 23
                     ];
					 
					 //RGB values
		var color = [1.0, 0.0, 0.0, //front A
					 1.0, 0.0, 0.0, //front B
					 1.0, 0.0, 0.0, //front C
					 1.0, 0.0, 0.0, //front D
					 1.0, 0.0, 0.0, //back E
					 1.0, 0.0, 0.0, //back F
					 1.0, 0.0, 0.0, //back G
					 1.0, 0.0, 0.0, //back H
					 0.0, 1.0, 0.0, //left A'
					 0.0, 1.0, 0.0, //left D'
					 0.0, 1.0, 0.0, //left H'
					 0.0, 1.0, 0.0, //left E'
					 0.0, 1.0, 0.0, //right B'
					 0.0, 1.0, 0.0, //right F'
					 0.0, 1.0, 0.0, //right G'
					 0.0, 1.0, 0.0, //right C'
					 0.0, 0.0, 1.0, //top D''
					 0.0, 0.0, 1.0, //top C''
					 0.0, 0.0, 1.0, //top G''
					 0.0, 0.0, 1.0, //top H''
					 0.0, 0.0, 1.0, //bottom A''
					 0.0, 0.0, 1.0, //bottom E''
					 0.0, 0.0, 1.0, //bottom F''
					 0.0, 0.0, 1.0, //bottom B''
					];
         
		var triangles = 
					[ 0,1,3,		//front ABD
					  1,2,3,		//front BCD
					  12,13,15,		//right B'F'C'
					  13,14,15,		//right F'G'C'
					  20,21,23,		//bottom A''E''B''
					  23,21,22,		//bottom B''E''F''
					  8,9,11,		//left A'D'E'
					  11,9,10,		//left E'D'H'
					  16,17,19,		//top D''C''H''
					  17,18,19,		//top C''H''G''
					  4,7,5,		//back EHF
					  5,7,6			//back FHG   
					];
		 
        // therer are 3 floats per vertex, so...
        this.numVertices = coords.length / 3;
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );
		//attribute buffer to set specified per-vertex colors										  
		this.colorBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": color 
                                                  } );
		//element buffer to relate the vertices to triangles			
		this.triangleBuf = new vbo.Indices(gl, {"indices": triangles});
    };

    // draw method: activate buffers and issue WebGL draw() method
    Cube.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, "vertexPosition");
		this.colorBuffer.bind(gl, program, "vertexColor");
		this.triangleBuf.bind(gl);
		   
        // draw the vertices as triangles, two triangles for each square of the cube
		//@triangleBuf.numIndices() : returns triangles.length which doesn't work in this context
        gl.drawElements(gl.TRIANGLES, this.triangleBuf.numIndices(), gl.UNSIGNED_SHORT, 0); 
         
    };
        
    // this module only returns the constructor function    
    return Cube;

})); // define

    
