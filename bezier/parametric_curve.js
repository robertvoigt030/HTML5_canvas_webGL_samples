/*
 * JavaScript 
 * (C)opyright Robert Voigt and Maté Strysewske
 *
 * Module: parametric_curve
 *
 * A curve that can be drawn with given parameters of the user.
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "control_polygon"], 
       (function(Util, vec2, Scene, PointDragger, ControlPolygon) {
        
    "use strict";
    
    var ParametricCurve = function(drawStyle, tmin, tmax, fx, fy, seg, tickMarks) {
        
        // draw style for drawing the curve
        this.drawStyle = drawStyle || { width: "4", color: "#0000AA" };

        // initial values in case any of the fields is undefined
		this.fx = fx;
		this.fy = fy;
		this.tmin = tmin || 0;
		this.tmax = tmax || 5;
		this.seg = seg || 20;
		this.tickFlag = tickMarks; // check whether tick marks is checked or not 
		this.seglength = 0;	// the length of the curve's segments
		this.curvePoints = []; // an array that contains all curve points
		
    };

    /*
     * draw this curve into the provided 2D rendering context
     */
    ParametricCurve.prototype.draw = function (context) {
		
		var _curve = this;
		
		// eval function to interprete the formula, given as a string argument, mathematically
		var Func = function(t, formula) {
			var result = eval(formula);
			return result;
		}
		
		// check whether the given formula's syntax is valid or not
		// if not, the object will not be drawn
		try {
			Func(_curve.tmin, _curve.fx);
			Func(_curve.tmin, _curve.fy);
		} catch(err) {
			//alert("The notation of the given formula seems to be wrong.\n \t\t The formula needs following terms:\n for x(t): \t \"Math.sin(t)\" \t\t for y(t): \t\t \"Math.cos(t)\" ");
			return;
		}
		
		// clear the curve points array
		_curve.curvePoints = [];
		
        // what shape to draw
        _curve.seglength = (_curve.tmax - _curve.tmin) / _curve.seg; // length of one segment
		context.beginPath();
		for(var i = 0 ; i < _curve.seg ; i++){
			
			var p0 = [Func(i * _curve.seglength, _curve.fx), Func(i * _curve.seglength, _curve.fy)];
			var p1 = [Func((i + 1) * _curve.seglength, _curve.fx), Func((i + 1) * _curve.seglength, _curve.fy)];
			
			context.moveTo(p0[0], p0[1]);
			context.lineTo(p1[0], p1[1]);
			
			_curve.curvePoints.push(p0);
			if((i+1) == _curve.seg){_curve.curvePoints.push(p1)};
		}
		
		// set drawing style
        context.lineWidth = _curve.drawStyle.width;
        context.strokeStyle = _curve.drawStyle.color;
        
        // actually start drawing
        context.stroke();
	
		// draw segment ticks if checkbox is checked
		if(this.tickFlag) {
			context.beginPath();
			for (var j = 1;j < _curve.curvePoints.length-1;j++){
			
				var dirvec = vec2.sub(_curve.curvePoints[j+1],_curve.curvePoints[j-1]);
				var normdirvec = vec2.mult(dirvec,1/vec2.length(dirvec));

				context.moveTo(_curve.curvePoints[j][0], _curve.curvePoints[j][1]);
				context.lineTo(_curve.curvePoints[j][0] + normdirvec[0], _curve.curvePoints[j][1] + normdirvec[1]);
			}
		
			context.lineWidth = this.drawStyle.width*5;
			context.strokeStyle = "#FF0000";
		
			// actually start drawing
			context.stroke();
		}
    };
	
    // test whether the mouseclick hits the curve

    ParametricCurve.prototype.isHit = function(context,mousePos) {
	
		for(var i = 0;i<this.curvePoints.length-1;i++){
			var p0 = this.curvePoints[i];
			var p1 = this.curvePoints[i+1];
			
			// project point on line, get parameter of that projection point
			var t = vec2.projectPointOnLine(mousePos, p0, p1);
                
			// check if t is inside the line segment
			if(t>0.0 && t<1.0) {
             
				// coordinates of the projected point 
				var p = vec2.add(p0, vec2.mult( vec2.sub(p1,p0), t ));

				// distance of the point from the line
				var d = vec2.length(vec2.sub(p,mousePos));
				
				//console.log("was the object hit?: " + (d <= (this.drawStyle.width/2+2)));

				if(d <= (this.drawStyle.width/2+2)){
					//console.log("Object was hit.");
					return d <= (this.drawStyle.width/2+2);
				}
			}
		}
    };
	
    
    // return empty list of draggers, because there was no drag-interaction scheduled for the curve
    ParametricCurve.prototype.createDraggers = function() {
        
        var draggers = [];
        return draggers;
        
    };
    
    // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

})); // define
