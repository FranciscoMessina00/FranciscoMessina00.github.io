function drawDodecagon(index, stepPlaying){
    var cornerRadius = 30*scale;
    ctx.lineWidth = 7*scale;
    const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, 100);
    if(index == stepPlaying && seq.isPlaying()){
        grd.addColorStop(1*scale, colorPlayingOut);
        grd.addColorStop(0*scale, colorPlayingIn);
        ctx.strokeStyle = strokePlaying;
    } else{
        ctx.strokeStyle = strokeNotPlaying;
        grd.addColorStop(1*scale, colorDodOffOut);
        grd.addColorStop(0*scale, colorDodOffIn);
        if(index == seq.getSelected()){
            ctx.lineWidth = 10*scale;
            ctx.strokeStyle = strokeSelected;
            // grd.addColorStop(1*scale, colorDodOnOut);
            // grd.addColorStop(0*scale, colorDodOnIn);
        }
        // else{
        //     grd.addColorStop(1*scale, colorDodOffOut);
        //     grd.addColorStop(0*scale, colorDodOffIn);
        // }
        
        determineGradient(index, grd, seq.getChannelIndex());
        
    }
    
    ctx.fillStyle = grd;
    ctx.beginPath(); // start a new path
    roundedPoly(dodecagon, cornerRadius);
    ctx.fill();
    ctx.stroke();
}

function drawRect(step, index, stepPlaying){
    ctx.beginPath();
    var sideRect = 80*scale;
    var heightRect = 16*scale;
    var yPos = -60*scale;
    var rad = 5*scale;
    ctx.globalAlpha = 1;
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
    ctx.clearRect(clearArea.x + (canvas.width / 16) * index, clearArea.y, clearArea.width, clearArea.height);
    ctx.translate(posX, posY);
    // ctx.scale(scale, scale);
    drawDodecagon(index, stepPlaying);
    drawRect(step, index, stepPlaying);
    // ctx.scale(1/scale, 1/scale);
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
    for (var i = 0; i < 16; i++) {
        // drawStep((100  + i * 220 + 10) * scale, (100 + 10) * scale, scale, steps[i], i == selected);
        // starting drawing 100 pixels plus a padding from the left 
        // console.log(seq.getChannelSteps()[i]);
        drawStep((100 + space/2) * scale + (canvas.width / 16) * i, heightShift, scale, seq.getChannelSteps()[i].getToPlay(), i, seq.getStepPlaying());
    }
    // requestAnimationFrame(drawSequencer);
}

function drawSingleStep(i){
    drawStep((100 + space/2) * scale + (canvas.width / 16) * i, heightShift, scale, seq.getChannelSteps()[i].getToPlay(), i, seq.getStepPlaying());
}

function drawLittleSteps(channel, index){
    for(var i = 0; i < 16; i++){
        channel.innerHTML += '<span id="'+ index + i +'" class="littleStep"></span>';
    }
}
function determineGradient(index, grd, channelIndex){
    switch(channelIndex){
        case 0: // we are in the melody channel
            var interior = spaceAttack(index);
            var exterior = interior + spaceRelease(index);
            if (exterior > 1) {
                exterior = 1 - 0.001;
            }
            var colorFrequency = colorStep(index);
            grd.addColorStop(exterior*scale, colorFrequency);
            grd.addColorStop(interior*scale, colorFrequency);
            break;
        case 1: // we are in the beat channel
            var kickColor = intensityStep(index, 0);
            var snareColor = intensityStep(index, 1);
            var hihatColor = intensityStep(index, 2);
            var tomColor = intensityStep(index, 3);

            grd.addColorStop(0*scale, kickColor);
            grd.addColorStop(0.25*scale, kickColor);
            grd.addColorStop(0.3*scale, snareColor);
            grd.addColorStop(0.5*scale, snareColor);
            grd.addColorStop(0.55*scale, hihatColor);
            grd.addColorStop(0.75*scale, hihatColor);
            grd.addColorStop(0.8*scale, tomColor);
            grd.addColorStop(0.95*scale, tomColor);

            break;
    }
}
function spaceAttack(index){
    var step = seq.getIndexStep(index);
    var attack = step.getAdsrMix().attack;
    var proportion = attack / 500;
    return proportion;
}
function spaceRelease(index){
    var step = seq.getIndexStep(index);
    var release = step.getAdsrMix().release;
    var proportion = release / 500;
    return proportion;
}
function colorStep(index){
    // console.log(index);
    var step = seq.getIndexStep(index);
    var frequency = step.getOscParam().freq;
    var hue = Math.log10(frequency) / Math.log10(20000);
    var waveType = step.getOscParam().type;
    switch(waveType){
        case 'sine':
            saturation = 0.50;
            break;
        case 'triangle':
            saturation = 0.66;
            break;
        case 'square':
            saturation = 0.82;
            break;
        case 'sawtooth':
            saturation = 1;
            break;
    }
    var mod = step.getOscParam().mod==0 ? 0.1 : step.getOscParam().mod;
    var harm = step.getOscParam().harm==0 ? 0.1 : step.getOscParam().harm;
    var vol = parseFloat(step.getOscParam().volume)==0 ? 0.1 : parseFloat(step.getOscParam().volume);
    var valueColor = (vol/2) + (Math.log(mod * harm + 1)/(2 * Math.log(3000 + 1)));
    // console.log(hue, saturation, valueColor)
    var rgb = hsvToRgb(hue, saturation, valueColor);
    // console.log(rgb);
    return "#" + ((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1);;
}
function hsvToRgb(h, s, v) {
    var r, g, b;
  
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
  
    return  {red: Math.round(r * 255), green: Math.round(g * 255), blue: Math.round(b * 255) };
}
function intensityStep(index, instrument){
    var step = seq.getIndexStep(index);
    switch(instrument){
        case 0:
            var intensity = (step.getKick().volume * 0.7) + 0.1;
            break;
        case 1:
            var intensity = (step.getSnare().volume * 0.7) + 0.1;
            break;
        case 2:
            var intensity = (step.getHat().volume * 0.7) + 0.1;
            break;
        case 3:
            var intensity = (step.getTom().volume * 0.7) + 0.1;
            break;
    }
    
    var rgb = hsvToRgb(0, 0, intensity);
    return "#" + ((1 << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue).toString(16).slice(1);;
}