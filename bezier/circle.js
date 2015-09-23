/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Robert Voigt and Maté Strysewskè
 *
 * Module: circle
 *
 * A circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
        
    "use strict";
    
    /**
     *  A simple circle that can be dragged 
     *  around by its center.
     *  Parameters:
     *  - point0: array object representing [x,y] coordinates of circles center
     *  - lineStyle: object defining width and color attributes for line drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
	 *  - radius: represents the radius of the circle object as an integer
     */ 
    var Circle = function(point0, radius, drawStyle) {
        console.log("creating circle with center at [" + 
                    point0[0] + "," + point0[1] + "] and radius: " + radius +".");
        
        // draw style for drawing the line
        this.drawStyle = drawStyle || { width: "4", color: "#0000AA" };

        // initial values in case any of these fields is undefined
        this.p0 = point0 || [10,10];
        this.radius = radius || 20; 
    };

    /*
     * draw this line into the provided 2D rendering context
	 * draw the dragger as a small circle
     */
    Circle.prototype.draw = function (context) {
        
        // what shape to draw
        context.beginPath();
        context.arc(this.p0[0], this.p0[1], 	// position
                    this.radius,    			// radius
                    0.0, Math.PI*2,           	// start and end angle
                    true);                    	// clockwise
        context.closePath();
        
        // draw style
        context.lineWidth   = this.drawStyle.width;
        context.strokeStyle = this.drawStyle.color;
        context.fillStyle   = this.drawStyle.color;
        
        // trigger the actual drawing
        if(this.drawStyle.fill) {
            context.fill();
        };
        context.stroke();
    };

    // test whether the mouseclick hits the circles border
    Circle.prototype.isHit = function(context,mousePos) {
    
        // formula: P(x,y) circles center <=> (x-p0[0])²+(y-p0[1])²=radius²
		// +/-2 px tolerance added
        var dx = mousePos[0] - this.p0[0];
        var dy = mousePos[1] - this.p0[1];
        var r = this.radius+(this.drawStyle.width/2);
        return ((((dx*dx) + (dy*dy)) >= ((r-2)*(r-2))) && (((dx*dx) + (dy*dy)) <= ((r+2)*(r+2))));
    };
    
    // return list of draggers to manipulate this circle
	// - p1: coordinate for second dragger
	// - delta[1]: y coordinate from difference of current and cursor's last position during mousemove event(scene_controller)
    Circle.prototype.createDraggers = function() {
        
        var draggerStyle = { radius:4, color: this.drawStyle.color, width:0, fill:true }
        var draggers = [];
        
        // create closure and callbacks for dragger
        var _circle = this;
        var getP0 = function() { return _circle.p0; };
		var getRadius = function() { return _circle.radius; };
		var getP1 = function() { return [_circle.p0[0],_circle.p0[1] + _circle.radius]; }; 
		
	
        var setP0 = function(dragEvent) { 
			_circle.p0 = dragEvent.position;
		};
		
		// set new radius when second dragger is used
		var setP1 = function(dragEvent) {
			_circle.radius += dragEvent.delta[1]; // could be also: parseInt(vec2.length(vec2.sub(dragEvent.position,_circle.p0)))
		};
        draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
		draggers.push( new PointDragger(getP1, setP1, draggerStyle) ); // add second dragger to the draggers array
        
        return draggers;
        
    };
    
    // this module only exports the constructor for Circle objects
    return Circle;

})); // define
