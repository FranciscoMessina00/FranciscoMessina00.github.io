function drawDodecagon(selected){
    var cornerRadius = 30;
    ctx.lineWidth = 4;
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
    if(!selected){
        grd.addColorStop(1, '#D9D9D9');
        grd.addColorStop(0, '#B1B1B1');
        ctx.strokeStyle = "#44116C";
    }else{
        grd.addColorStop(1, '#8951FF');
        grd.addColorStop(0, '#BE6AFF');
        ctx.strokeStyle = "#44116C";
    }
    ctx.fillStyle = grd;
    ctx.beginPath(); // start a new path
    roundedPoly(dodecagon, cornerRadius);
    ctx.fill();
    ctx.stroke();
}

function drawRect(step, isSelected){
    ctx.beginPath();
    var sideRect = 80;
    var heightRect = 16;
    var yPos = -60;
    var rad = 5;
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 0;
    if(step == 1){
        ctx.fillStyle = "#C80000";
    }
    else{
        ctx.fillStyle = !isSelected ? "#7B7B7B" : "#FF9CD2";
    }
    
    ctx.roundRect(-sideRect/2, yPos, sideRect, heightRect, rad);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawStep(posX, posY, scale = 1, step = 0, isSelected = false){
    ctx.translate(posX, posY);
    ctx.scale(scale, scale);
    drawDodecagon(isSelected);
    drawRect(step, isSelected);
    ctx.scale(1/scale, 1/scale);
    ctx.translate(-posX, -posY);
}

var roundedPoly = function(points,radius){
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
    var asVec = function (p, pp, v) { // convert points to a line with len and normalised
        v.x = pp.x - p.x; // x,y as vec
        v.y = pp.y - p.y;
        v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
        v.nx = v.x / v.len; // normalised
        v.ny = v.y / v.len;
        v.ang = Math.atan2(v.ny, v.nx); // direction of vec
    }
    v1 = {};
    v2 = {};
    len = points.length;                         // number points
    p1 = points[len - 1];                        // start at end of path
    for (i = 0; i < len; i++) {                  // do each corner
        p2 = points[(i) % len];                  // the corner point that is being rounded
        p3 = points[(i + 1) % len];
        // get the corner as vectors out away from corner
        asVec(p2, p1, v1);                       // vec back from corner point
        asVec(p2, p3, v2);                       // vec forward from corner point
        // get corners cross product (asin of angle)
        sinA = v1.nx * v2.ny - v1.ny * v2.nx;    // cross product
        // get cross product of first line and perpendicular second line
        sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
        angle = Math.asin(sinA);                 // get the angle
        radDirection = 1;                        // may need to reverse the radius
        drawDirection = false;                   // may need to draw the arc anticlockwise
        // find the correct quadrant for circle center
        if (sinA90 < 0) {
            if (angle < 0) {
                angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
            } else {
                angle = Math.PI - angle; // move back into the 2nd quadrant
                radDirection = -1;
                drawDirection = true;
            }
        } else {
            if (angle > 0) {
                radDirection = -1;
                drawDirection = true;
            }
        }
        halfAngle = angle / 2;
        // get distance from corner to point where round corner touches line
        lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
        if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
            lenOut = Math.min(v1.len / 2, v2.len / 2);
            // ajust the radius of corner rounding to fit
            cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
        } else {
            cRadius = radius;
        }
        x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
        y = p2.y + v2.ny * lenOut;
        x += -v2.ny * cRadius * radDirection; // move away from line to circle center
        y += v2.nx * cRadius * radDirection;
        // x,y is the rounded corner circle center
        ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
        p1 = p2;
        p2 = p3;
    }
    ctx.closePath();
}

function drawSequencer(){
    var scale = 0.3;
    for (var i = 0; i < 16; i++) {
        // drawStep((100  + i * 220 + 10) * scale, (100 + 10) * scale, scale, steps[i], i == selected);
        drawStep((100 + 50/2) * 0.3 + (canvas.width / 16) * i, canvas.height - canvas.height/2, scale, steps[i], i == selected)
    }
    requestAnimationFrame(drawSequencer);
}
function detectClick(){
    const widthCell = (canvas.width / 16);
    const heightCell = canvas.height;
    canvas.addEventListener("mouseup", (e) => {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        
        var posX = (x/widthCell) - 0.5;
        var posY = (y/heightCell) - 0.5;

        var j = Math.round(posY);
        console.log(j);
        var i = Math.round(posX);
        console.log(i);
        var distance = Math.sqrt((Math.abs(posX) - i)**2 + (Math.abs(posY) - j)**2);
        console.log(distance);
        switch (e.button) {
          case 0:
            if((Math.abs(posX) - i < 100*0.3/widthCell) && (Math.abs(posY) - j < 100*0.3/heightCell) && (distance < 100*0.3/widthCell || distance < 100*0.3/heightCell)){
                console.log(i);
                steps[i] = 1 - steps[i];
            }
            break;
          case 1:
            // middle clicked
            
            break;
          case 2:
            // right clicked
            if((Math.abs(posX) - i < 100*0.3/widthCell) && (Math.abs(posY) - j < 100*0.3/heightCell)){
                console.log(i);
                selected = i;
            }
            break;
        }
      });
}

function detectKnob(){
    knobs = document.querySelectorAll(".container");
    
    knobs.forEach(c=> c.addEventListener("mousedown", (e) => {
        prevMouseY = e.pageY;
        knob = c.querySelector(".knob");
        if(knob == null){
            knob = c.querySelector(".waveType");
        }
        label = c.querySelector("input");
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        label.addEventListener("change", updateKnob);
    }));

}
function setInitialKnobValues(){
    knobs.forEach(kn => setSingleKnobValues(kn));
}
function setSingleKnobValues(kn){
    knob = kn.querySelector(".knob");
    label = kn.querySelector("input");
    resizeInput(label);
    // we get maximum and minimum values of label and normalize the range from -170 to 170
    if (knob != null){
        normalizedValue = normalizeToAngle(label);
        knob.style.rotate = normalizedValue + "deg";
    }
}
function normalizeToAngle(label){
    var max = parseFloat(label.max);
    var min = parseFloat(label.min);
    var value = parseFloat(label.value);
    if (value > max) {
        label.value = max;
    }else if (value < min) {
        label.value = min;
    }
    var normalizedValue = (value - min) * 340 / (max - min) - 170;
    if(normalizedValue < -170){
        normalizedValue = -170;
    }else if(normalizedValue > 170){
        normalizedValue = 170;
    }
    return normalizedValue;
}
function normalizeToValue(value, label){
    // we get from -170 to 170 values and normalize the range to the min of the label and max of the label
    var max = parseFloat(label.max);
    var min = parseFloat(label.min);
    var normalizedValue = (value + 170) * (max - min) / 340 + min;
    return normalizedValue;
}
function focusInput(){
    console.log(label);
    knobToChange = knob;
    labelToChange = label;
    labelToChange.style.width = 5 + "ch";
    labelToChange.dispatchEvent(enterKey);
    labelToChange.focus();
}
function updateKnob(){
    labelToChange.blur();
    resizeInput(labelToChange);
    // we get maximum and minimum values of label and normalize the range from -170 to 170
    normalizedValue = normalizeToAngle(labelToChange);
    knob.style.rotate = normalizedValue + "deg";
}
function onMouseMove(event){
    // console.log(parseInt(label.value));
    if(knob.classList.contains("knob")){
        lastCurrentRadiansAngle = normalizeToAngle(label);
        if(event.shiftKey){
            scaling = 0.1;
        }
        else{
            scaling = 1.2;
        }

        mouseY =  - (event.pageY - prevMouseY) ; //get mouse's y position relative to the previous one
        finalAngleInDegrees = ((mouseY * scaling) + lastCurrentRadiansAngle);
        

        //only allowed to rotate if greater than zero degrees or less than 270 degrees
        if(finalAngleInDegrees >= -170 && finalAngleInDegrees <= 170)
        {
            knob.style.rotate = finalAngleInDegrees + "deg";
        }
        if(finalAngleInDegrees < -170)
        {
            finalAngleInDegrees = -170;
        }
        else if(finalAngleInDegrees > 170)
        {
            finalAngleInDegrees = 170;
        }

        if(label.step.length != 1){
            label.value = normalizeToValue(finalAngleInDegrees, label).toFixed(label.step.length - 2);
        } else{
            label.value = normalizeToValue(finalAngleInDegrees, label).toFixed(0);
        }
        
        resizeInput(label);
        prevMouseY = event.pageY;
    }
}

function onMouseUp(){ 
    // label.value = normalizeToValue(finalAngleInDegrees, label);
    resizeInput(label);
    document.removeEventListener("mousemove", onMouseMove); //stop drag
}
function resizeInput(input) {
    input.style.width = input.value.length + "ch";
  }
document.addEventListener('contextmenu', event => event.preventDefault());
var channels = [1, 0, 0, 0]
var steps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var canvas = document.getElementById("step");
var ctx = canvas.getContext("2d");
var selected = 0;

var dodecagon = [
    {x: 0   , y: -100},
    {x: -50 , y: -87 },
    {x: -87 , y: -50 },
    {x: -100, y: 0   },
    {x: -87 , y: 50  },
    {x: -50 , y: 87  },
    {x: 0   , y: 100 },
    {x: 50  , y: 87  },
    {x: 87  , y: 50  },
    {x: 100 , y: 0   },
    {x: 87  , y: -50 },
    {x: 50  , y: -87 },
]

var filterContainer = document.getElementById("filter1");
var filterCutoff = {
    knob: document.getElementById("cutoff"),
}
const enterKey = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    which: 13,
    keyCode: 13,
  });
var lastCurrentRadiansAngle = 0;
var knob;
var knobToChange;
var knobs;
var label;
var labelToChange;
var knobPositionY;
var prevMouseY;
var mouseY;
var knobCenterY;
var oppositeSide;
var getRadiansInDegrees;
var finalAngleInDegrees;

var scale = 0.3;
canvas.width  = 1200;
canvas.height = 86;
requestAnimationFrame(drawSequencer);
detectClick();
detectKnob();
setInitialKnobValues();
