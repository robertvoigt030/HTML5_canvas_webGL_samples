/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Robert Voigt and Maté Strysewske
 *
 * Module: bezier_curve
 *
 * A Bézier curve that contains draggable points to manipulate this curve 
 * and a control polygon. There is also an option to show the borders between the single segments. 
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "control_polygon", "parametric_curve"], 
       (function(Util, vec2, Scene, PointDragger, ControlPolygon, ParametricCurve) {
        
    "use strict";
    
    /**
     *  A Bézier curve that can be dragged
     *  around by its start-, way- and endpoints.
     *  Parameters:
     *  - seg: amount of segments
     *  - p0: startpoint of the curve
	 *	- p1,p2: waypoints of the curve
	 *	- p3: endpoint of the curve
     */ 
    var BezierCurve = function(drawStyle, seg, p0, p1, p2, p3, tickMarks) {
        
        // draw style for drawing the curve
        this.drawStyle = drawStyle || { width: "4", color: "#0000AA" };

        // initial values in case some of the method parameters are undefined
		this.p0 = p0 || [0,0];
		this.p1 = p1 || [1,1];
		this.p2 = p2 || [2,2];
		this.p3 = p3 || [3,3];
		this.fx = "(Math.pow((1-t),3) * _curve.p0[0]) + (3 * Math.pow((1-t),2) * t * _curve.p1[0]) + (3 * (1-t) * Math.pow(t,2) * _curve.p2[0]) + (Math.pow(t,3) * _curve.p3[0])";
		this.fy = "(Math.pow((1-t),3) * _curve.p0[1]) + (3 * Math.pow((1-t),2) * t * _curve.p1[1]) + (3 * (1-t) * Math.pow(t,2) * _curve.p2[1]) + (Math.pow(t,3) * _curve.p3[1])";
		this.tmin = 0;
		this.tmax = 1;
		this.seg = seg || 20;
		this.tickFlag = tickMarks; // check whether tick marks is checked or not 
		this.seglength = 0;	// the length of the curve's segments
		this.curvePoints = []; // an array that contains all curve points
    };

    /*
     * draw this curve into the provided 2D rendering context
     */
    BezierCurve.prototype.draw = ParametricCurve.prototype.draw;
	
	/*
	* test whether the mouseclick hits the curve
	*/
	BezierCurve.prototype.isHit = ParametricCurve.prototype.isHit;
	
    // returns a list of draggers to manipulate this curve
	// - polygonStyle: ControlPolygon only needs color and width, more details are provided within the control_polygon module
	// - draggerStyle2: used for the draggers outside the curve, which are not filled out
	// - getPoints defines a function that is able to return all four points of the curve in an array
    BezierCurve.prototype.createDraggers = function() {
		
        var draggerStyle = { radius:4, color: "#0000FF", width:0, fill:true }
		var draggerStyle2 = { radius:4, color: "#0000FF", width:0, fill:false }
		var polygonStyle = { color: "#0000FF", width:1 }
        var draggers = [];
		
		var _bezCurve = this;
        var getP0 = function() { return _bezCurve.p0; };
        var getP1 = function() { return _bezCurve.p1; };
		var getP2 = function() { return _bezCurve.p2; };
		var getP3 = function() { return _bezCurve.p3; };
		var getPoints = function() { return [ _bezCurve.p0, _bezCurve.p1, _bezCurve.p2, _bezCurve.p3 ] };
		
        var setP0 = function(dragEvent) { _bezCurve.p0 = dragEvent.position; };
        var setP1 = function(dragEvent) { _bezCurve.p1 = dragEvent.position; };
		var setP2 = function(dragEvent) { _bezCurve.p2 = dragEvent.position; };
		var setP3 = function(dragEvent) { _bezCurve.p3 = dragEvent.position; };
		
        draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
        draggers.push( new PointDragger(getP1, setP1, draggerStyle2) );
		draggers.push( new PointDragger(getP2, setP2, draggerStyle2) );
		draggers.push( new PointDragger(getP3, setP3, draggerStyle) );
		draggers.push( new ControlPolygon(getPoints,polygonStyle) );
		
        return draggers;
        
    };
    
    // this module only exports the constructor for BezierCurve objects
    return BezierCurve;

})); // define
