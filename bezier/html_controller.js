/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle", "parametric_curve", "bezier_curve"], 
       (function($, StraightLine, Circle, ParametricCurve, BezierCurve) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
    
    
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };
		
        //generate random radius within the canvas to get smaller circles
        var randomRadius = function(){
            return Math.floor(Math.random()*(context.canvas.height-10)/4)+5;
        };
        
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };
        
        /*
         * define the event handler for the "New Line" button
         */
        $("#btnNewLine").click( (function() {
			
			func_x.value = "";
			func_y.value = "";
			
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));
        
        /*
         * define the event handler for the "New Circle" button
         */
        $("#btnNewCircle").click( (function() {
			
			func_x.value = "";
			func_y.value = "";
			
            // create the actual circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
            var circle = new Circle( [randomX(),randomY()], 
                                    randomRadius(), style);
            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));
		
		/*
         * define the event handler for the "New Parametric Curve" button
         */
		$("#btnNewParaCurve").click( (function() {
			
			// check whether there are values from the Bézier curve in the formula input field (x(t))
			// if so, clear both fields x(t) and y(t)
			if(func_x.value.indexOf("p3")!= -1){
				func_x.value = "";
				func_y.value = "";
				
				};
			
            // create the actual parametric curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };

			
			// attention: when the constructor is called, the contents of these input fields are taken as values
			// predefined values will be taken for the fields that are empty (respectively random values for x(t) and y(t))
            var param = new ParametricCurve(style,
											$("#t_min").val(),
											$("#t_max").val(),
											($("#func_x").val() || randomX() + "+" + randomY() + "* Math.sin(t)"),
											($("#func_y").val() || randomX() + "+" + randomY() + "* Math.cos(t)"),
											$("#segm").val(),
											$("#tick").attr("checked"));
            scene.addObjects([param]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(param); // this will also redraw
                        
        }));
		
		/*
         * defines the event handler for the "New Bézier Curve" button
         */
		$("#btnNewBezierCurve").click( (function() {

            // create the actual curve and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
			
            var bezier = new BezierCurve(style,
											$("#segm").val(),
											[randomX(), randomY()],
											[randomX(), randomY()],
											[randomX(), randomY()],
											[randomX(), randomY()],
											$("#tick").attr("checked"));
           
			scene.addObjects([bezier]);
			
            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(bezier); // this will also redraw
                        
        }));
	
	
        // a callback function that fills the input fields with the values of the current chosen object
		// it will also hide or show specific fields of other objects when none of those is selected
		var callback1 = sceneController.onSelection(function(selectedObj) {
		
			// these elements are displayed for every object
			var color = selectedObj.drawStyle.color;
			var linewidth = selectedObj.drawStyle.width;
			
			lineWidth.value = linewidth;
			objectColor.value = color;
			
			// this element is only displayed for circles
			var rad = selectedObj.radius;
			if(rad){
				$("#radius").show();
				$("#lradius").show();
				radius.value = rad;
			}else{
				$("#radius").hide();
				$("#lradius").hide();
			};
			
			// these elements are displayed for both parametric and Bézier curves
			var tmin = selectedObj.tmin;
			var tmax = selectedObj.tmax;
			var fx = selectedObj.fx;
			var fy = selectedObj.fy;
			var seg = selectedObj.seg;
			
			// this is only used by parametric and Bézier curves
			// check whether tmin is available for the current chosen object to decide whether the curve specific inputs and labels 
			// should be shown or not
			// cooperates with the tmin.change function below
			if(tmin > -1) {
			
				t_min.value = tmin;
				t_max.value = tmax;
				func_x.value = fx;
				func_y.value = fy;
				segm.value = seg;
				
				// labels
				$("#ltick").show();
				$("#lt_min").show();
				$("#lt_max").show();
				$("#lfunc_x").show();
				$("#lfunc_y").show();
				$("#lsegm").show();
				
				// inputs
				$("#tick").show();
				$("#t_min").show();
				$("#t_max").show();
				$("#func_x").show();
				$("#func_y").show();
				$("#segm").show();
				
				if(selectedObj.tickFlag) {
					tick.checked = true;
				} else {
					tick.checked = false;
				}
				
			}else{
			
				// labels
				$("#ltick").hide();
				$("#lt_min").hide();
				$("#lt_max").hide();
				$("#lfunc_x").hide();
				$("#lfunc_y").hide();
				$("#lsegm").hide();
				
				// inputs
				$("#tick").hide();
				$("#t_min").hide();
				$("#t_max").hide();
				$("#func_x").hide();
				$("#func_y").hide();
				$("#segm").hide();
			}
		});
		
		// change values in the radius input field if second dragger is used 
		// to change the radius of the current selected circle
		var callback2 = sceneController.onObjChange(function(selectedObj){
			if(this.isDragging){radius.value = selectedObj.radius;};
		});
        
        /*
         * click enter to apply changes in Firefox
		 * these handlers change the attributes of 
         * the current chosen object to the given 
		 * values of the depending input forms of the HTML document
		 */
		 
		// check whether the input starts with '#' and if length is 7 (hex-colorcode = '#' + six values)
		$("#objectColor").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			var inputColor = $("#objectColor").val()
			if(inputColor.length == 7 && inputColor.charAt(0) == '#'){
				selectedObj.drawStyle.color = inputColor;
			}
			sceneController.select(selectedObj);
			
			//scene.draw(context); -> scene.draw() doesn't work here, it misses to refresh draggers color however
        
		}));
        
		// change linewidth of the currently selected object
		$("#lineWidth").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			selectedObj.drawStyle.width = parseInt($("#lineWidth").val());
			scene.draw(context);   
        }));
		
		// handler for changes made in the "adjust radius" input field
		// check whether the field value is in a reasonable range
		// a circle's diameter can't be greater then the canvas' height or less than zero
		$("#radius").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			var inputRadius = parseInt($("#radius").val());
			if( inputRadius <= context.canvas.height/2 && inputRadius >= 0){
				selectedObj.radius = inputRadius;
			}else if(inputRadius < 0){selectedObj.radius = 0;}
			else{selectedObj.radius = context.canvas.height/2}
			scene.draw(context); 
		}));
		
		// check whether tmin is positive and if the selected object is not a Bézier curve
		// Beziér curves show their tmin value, but don't allow the user to change it
		$("#t_min").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			if(selectedObj && (parseInt($("#t_min").val()) >= 0) && !selectedObj.p3) {
				selectedObj.tmin = parseInt($("#t_min").val());
			};
			
			//scene.draw(context);
			
			sceneController.select(selectedObj);
        }));
		
		// Bézier curves show their tmax value, but don't allow the user to change it
		$("#t_max").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			if(!selectedObj.p3 && selectedObj){
				selectedObj.tmax = parseInt($("#t_max").val());
			};
			sceneController.select(selectedObj);
        }));
		
		
		$("#segm").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			if(selectedObj){
				selectedObj.seg = parseInt($("#segm").val());
			};
			sceneController.select(selectedObj);
        }));
		
		// check whether the checkbox is ticked or not and change the flag attribute of the current chosen curve
		$("#tick").change( (function() {
			var selectedObj = sceneController.getSelectedObject();
			if(selectedObj && $("#tick").attr("checked")) {
				selectedObj.tickFlag = true;
				sceneController.select(selectedObj);
			} else if (selectedObj) {
				selectedObj.tickFlag = false;
				sceneController.select(selectedObj);
			}
        }));
    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
