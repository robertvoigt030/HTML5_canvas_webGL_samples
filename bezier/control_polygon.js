/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: control_polygon
 *
 * A control polygon is an non-interactive dragger that represents the control polygon of a cubic Bézier curve
 *
 */


/* requireJS module definition */
define(["util", "scene"], 
       (function(Util,Scene) {

    "use strict";

    /*
     * Parameters:
     *
     * - getPos: [p0,p1,p2,p3] the four vec2 points of the Bézier curve
     *   callback function that will return the positions of these points
     *
     * - drawStyle [ { width: 2, color: "#FF00FF" } ] 
     *   specification object for the drawing style
     */

    var ControlPolygon = function(getPos, drawStyle) {

        // remember the callbacks
        this.getPos = getPos;
        
        // define the default draw style for the polygon
        drawStyle = drawStyle || {};
        this.drawStyle = {};
        this.drawStyle.width = drawStyle.width || 2;
        this.drawStyle.color = drawStyle.color || "#ff0000";
       
        // attribute queried by SceneController to recognize draggers
        this.isDragger = true; 
                                        
    };

    /*
     * draw the dragger as three simple lines from p0 to p1, p1 to p2 and p2 to p3
     */
    ControlPolygon.prototype.draw = function (context) {
	
        // get the current position
        var pos = this.getPos();

        // what shape to draw
        context.beginPath();
		
		for(var i=0;i<pos.length-1;i++){
			context.moveTo(pos[i][0],pos[i][1]);
			context.lineTo(pos[i+1][0],pos[i+1][1]);
		}

        // get the control polygon's style
        context.lineWidth   = this.drawStyle.width;
        context.strokeStyle = this.drawStyle.color;
      
        context.stroke();
    };

    /* 
     * does nothing but might be used by other modules
     */
    // ControlPolygon.prototype.isHit = function (context,mousePos) {
    // 		return;
    // };
        
    /*
     * non-interactive draggers do nothing and don't need this, 
	 * but the function may be called by other modules of the framework
     */
    // ControlPolygon.prototype.mouseDrag = function (dragEvent) {
	//		return;
    // };

    // this module only exposes the constructor for ControlPolygon objects
    return ControlPolygon;

})); // define
