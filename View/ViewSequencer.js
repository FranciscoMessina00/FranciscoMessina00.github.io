function drawDodecagon(index, stepPlaying){
    var cornerRadius = 30;
    ctx.lineWidth = 4;
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
    if(index == stepPlaying && seq.isPlaying()){
        grd.addColorStop(1, colorPlayingOut);
        grd.addColorStop(0, colorPlayingIn);
        ctx.strokeStyle = strokePlaying;
    } else{
        if(index != seq.getSelected()){
            grd.addColorStop(1, colorDodOffOut);
            grd.addColorStop(0, colorDodOffIn);
        }else{
            grd.addColorStop(1, colorDodOnOut);
            grd.addColorStop(0,colorDodOnIn);
        }
        ctx.strokeStyle = strokeNotPlaying;
    }
    
    ctx.fillStyle = grd;
    ctx.beginPath(); // start a new path
    roundedPoly(dodecagon, cornerRadius);
    ctx.fill();
    ctx.stroke();
}

function drawRect(step, index, stepPlaying){
    ctx.beginPath();
    var sideRect = 80;
    var heightRect = 16;
    var yPos = -60;
    var rad = 5;
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = "transparent";
    ctx.lineWidth = 0;
    if(index == stepPlaying && seq.isPlaying()){
        ctx.fillStyle = "#6C3D11";
    }else if(step == 1){
        ctx.fillStyle = "#C80000";
    }
    else{
        ctx.fillStyle = !(index == seq.getSelected()) ? colorRectOffNotSel : colorRectOffSel;
    }
    
    ctx.roundRect(-sideRect/2, yPos, sideRect, heightRect, rad);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
}

function drawStep(posX, posY, scale = 1, step = 0, index = 0, stepPlaying = 0){
    ctx.translate(posX, posY);
    ctx.scale(scale, scale);
    drawDodecagon(index, stepPlaying);
    drawRect(step, index, stepPlaying);
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
    // calculating the space between the dodecagons
    var space = ((canvas.width - (200 * 16 * scale)) / 16) / scale;
    for (var i = 0; i < 16; i++) {
        // drawStep((100  + i * 220 + 10) * scale, (100 + 10) * scale, scale, steps[i], i == selected);
        // starting drawing 100 pixels plus a padding from the left 
        // console.log(seq.getChannelSteps()[i]);
        drawStep((100 + space/2) * scale + (canvas.width / 16) * i, canvas.height - canvas.height/2, scale, seq.getChannelSteps()[i].getToPlay(), i, seq.getStepPlaying());
    }
    requestAnimationFrame(drawSequencer);
}

function drawLittleSteps(channel, index){
    for(var i = 0; i < 16; i++){
        channel.innerHTML += '<span id="'+ index + i +'" class="littleStep"></span>';
    }
}