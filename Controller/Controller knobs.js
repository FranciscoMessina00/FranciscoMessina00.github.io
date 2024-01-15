function onMouseMove(event){
    // when we move the mouse after we clicked on the knob we update the value of the parameter
    // we check if the knob is of the type knob so it can rotate (thi is because we have other types of knobs
    // like the ones of the wave type)
    if(knob.classList.contains("knob")){
        // we get the current angle of the knob
        lastCurrentRadiansAngle = parseFloat(knob.style.rotate);
        // we check if the shift key is pressed or not, in order to change the speed of the knob
        if(event.shiftKey){
            // slower speed
            scaling = 0.1;
        }
        else{
            // normal speed
            scaling = 1.2;
        }
        // we get the current vertical mouse position
        mouseY =  - (event.pageY - prevMouseY) ; //get mouse's y position relative to the previous one (which is defined in onMouseDown in the controller)
        // we change the value of the angle of the knob according to the mouse position scaled
        finalAngleInDegrees = ((mouseY * scaling) + lastCurrentRadiansAngle);
        
        //only allowed to rotate if greater than -170 degrees or less than 170 degrees
        if(finalAngleInDegrees >= -170 && finalAngleInDegrees <= 170)
        {
            knob.style.rotate = finalAngleInDegrees + "deg";
        }
        // just in case the knob goes out of bounds we reset it to the maximum or minimum value
        if(finalAngleInDegrees < -170)
        {
            finalAngleInDegrees = -170;
        }
        else if(finalAngleInDegrees > 170)
        {
            finalAngleInDegrees = 170;
        }

        // we check if the knob is a frequency knob or not, then we map the angle to the value of the parameter
        isLabelFrequency = label.parentNode.id.includes("freq") || label.parentNode.id.includes("cutoff") || label.parentNode.id.includes("rate");
        // we check if the parameter needs decimal places in the value or not
        var ck = knob.parentNode.children[1].children[0]
        if(ck.checked){
            var i = 0;
            var curr_val = 0; 

            if(label.step.length != 1){
                // if integer we round the value to the nearest integer
                curr_val = normalizeToValue(finalAngleInDegrees, label, isLabelFrequency).toFixed(label.step.length - 2);
            } else{
                curr_val = normalizeToValue(finalAngleInDegrees, label, isLabelFrequency).toFixed(0);
            }

            while (quant_f[i]['freq'] < curr_val && i < 114) {
                // console.log(quant_f[i]['freq'])
                i++;
            }
    
            label.type = 'text'
            label.value = quant_f[i]['note']
        }else{
            if(label.step.length != 1){
                // if integer we round the value to the nearest integer
                label.value = normalizeToValue(finalAngleInDegrees, label, isLabelFrequency).toFixed(label.step.length - 2);
            } else{
                label.value = normalizeToValue(finalAngleInDegrees, label, isLabelFrequency).toFixed(0);
            } 
        }
        
        
        resizeInput(label);
        updateParamValue();
        drawSingleStep(seq.getSelected());
        // we memorize the last vertical mouse position for the next time we move the mouse (after we onMouseUp will be updated on the next onMouseDown)
        prevMouseY = event.pageY;
    }
}

function onMouseUp(){ 
    // when we release the mouse button we update the value of the parameter
    
    resizeInput(label);
    // we remove the event listener for the mouse move, otherwise the knob will keep rotating when moving the mouse
    document.removeEventListener("mousemove", onMouseMove); //stop drag
}
function resizeInput(input) {
    // just get the HTML element and resize it to fit the value of the label
    input.style.width = input.value.length + "ch";
}

function changeLeft(category){
    // we change the image of the knob according to the direction we are going
    if(category == "oscillator"){
        var type = document.getElementById("oscType");
        var condition = (element) => element == type.value;

        var index = waveTypes.findIndex(condition);
        index--;
        if(index < 0){
            index = 3;
        }
        type.value = waveTypes[index].toLowerCase();
        var file = "View/Images/" + waveTypes[index] + ".png";
        document.getElementById("oscImg").src = file;
        
        resizeInput(type);
        
    }
    else if(category == "modulation"){
        var type = document.getElementById("modType");
        var condition = (element) => element == type.value;

        var index = waveTypes.findIndex(condition);
        index--;
        if(index < 0){
            index = 3;
        }
        type.value = waveTypes[index].toLowerCase();
        var file = "View/Images/" + waveTypes[index] + ".png";
        document.getElementById("modImg").src = file;
        
        resizeInput(type);
    }
    else{
        var type = document.getElementById("flangType");
        var condition = (element) => element == type.value;

        var index = waveTypes.findIndex(condition);
        index--;
        if(index < 0){
            index = 3;
        }
        type.value = waveTypes[index].toLowerCase();
        var file = "View/Images/" + waveTypes[index] + ".png";
        document.getElementById("flangImg").src = file;
        
        resizeInput(type);
    }
    updateParamValue();
    drawSingleStep(seq.getSelected());
}
function changeRight(category){
    // we change the image of the knob according to the direction we are going
    if(category == "oscillator"){
        var type = document.getElementById("oscType");
        var condition = (element) => element == type.value;

        var index = waveTypes.findIndex(condition);
        index = (index + 1) % 4;
        type.value = waveTypes[index].toLowerCase();
        var file = "View/Images/" + waveTypes[index] + ".png";
        document.getElementById("oscImg").src = file;

        resizeInput(type);
    }
    else if(category == "modulation"){
        var type = document.getElementById("modType");
        var condition = (element) => element == type.value;

        var index = waveTypes.findIndex(condition);
        index = (index + 1) % 4;
        type.value = waveTypes[index].toLowerCase();
        var file = "View/Images/" + waveTypes[index] + ".png";
        document.getElementById("modImg").src = file;

        resizeInput(type);
    }
    else{
        var type = document.getElementById("flangType");
        var condition = (element) => element == type.value;

        var index = waveTypes.findIndex(condition);
        index = (index + 1) % 4;
        type.value = waveTypes[index].toLowerCase();
        var file = "View/Images/" + waveTypes[index] + ".png";
        document.getElementById("flangImg").src = file;

        resizeInput(type);
    }
    updateParamValue()
    drawSingleStep(seq.getSelected());
}
function detectKnob(){
    // We get all the knobs
    knobs = document.querySelectorAll(".container");
    // For eah knob we add event listeners for when we click them
    knobs.forEach(c=> c.addEventListener("mousedown", (e) => {
        prevMouseY = e.pageY;
        knob = c.querySelector(".knob");
        if(knob == null){
            knob = c.querySelector(".waveType");
        }
        label = c.querySelector(".inputEl");
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        label.addEventListener("change", updateKnob);
    }));
    volumes = document.querySelectorAll(".volume");
    volumes.forEach(v => v.addEventListener("dblclick", () => {
        knob = v.querySelector(".knob");
        label = v.querySelector(".inputEl");
        var id = label.parentNode.id;
        var spl = id.split(".");
        var stp = seq.getChannelSteps();
        var params = stp[seq.getSelected()].getParams();
        for (let i = 0; i < params.length; i++) {
            if(params[i] == spl[0]){
                tmp_dict = params[i+1];
                for (var [key, value] of Object.entries(params[i + 1])){
                    if(key == spl[1]){
                        tmp_dict[key] == 0 ? tmp_dict[key] = 1 : tmp_dict[key] = 0;
                        params[i+1] = tmp_dict;
                    }
                }
            }
        }
        stp[seq.getSelected()].setParams(params);
        updateSingleSynthParams();
        updateKnobView(v);
        drawSingleStep(seq.getSelected());
    }));
}
//function to quantize the frequencies into 440Hz - based notes
function quantize_frequencies(label){
    var input = document.getElementById(label).children[1];
    var ck = document.getElementById(label).parentNode.children[0].children[1].children[0]
    var curr_val;   

    if(ck.checked == true){
        seq.getChannelSteps()[seq.getSelected()].getOscParam().quant = true;
        var i = 0;

        curr_val = Number(input.value);

        while (quant_f[i]['freq'] < curr_val && i < 114) {
            i++;
        }

        input.type = 'text';
        input.value = quant_f[i]['note'];
        input.disabled = true;
        var type = document.getElementById("typeOfValue");
        type.innerHTML = "Note";
        var udm = document.getElementById("unitOfMeasure");
        udm.innerHTML = "";
    }
    else{
        seq.getChannelSteps()[seq.getSelected()].getOscParam().quant = false;
        var i = 0;
        curr_val = input.value
        while (quant_f[i]['note'] != curr_val) {
            i++;
        }
        input.type = 'number'
        input.value = quant_f[i]['freq'];
        input.disabled = false;
        var type = document.getElementById("typeOfValue");
        type.innerHTML = "Frequency";
        var udm = document.getElementById("unitOfMeasure");
        udm.innerHTML = "Hz";
    }
    updateColorChannel(seq.getChannelIndex());
    resizeInput(input);
}
function focusInput(){
    // Here we focus the input HTML element so that we can write in it
    // we define the knob and label to change
    knobToChange = knob;
    labelToChange = label;
    // we add the event listener to the document for the enter key
    labelToChange.dispatchEvent(enterKey);
    labelToChange.focus();
}
//function to copy current view value to all channel's steps
function copyToAll(){
    var steps = seq.getChannelSteps();
    var current_pars = steps[seq.getSelected()].getParams();
    
    steps.forEach(e => {    
        e.setParams(current_pars)
    });
    drawSequencer()
}
detectKnob();
setInitialKnobValues();