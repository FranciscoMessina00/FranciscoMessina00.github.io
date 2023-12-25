function setInitialKnobValues(){
    // We get all the knobs in the page and set their values to the default values
    knobs.forEach(kn => setSingleKnobValues(kn));
}

//init of knobs based on Default.js values
function setSingleKnobValues(kn){
    knob = kn.querySelector(".knob");
    label = kn.querySelector(".inputEl");
    // to get the id of the parameter connected to the div
    // var parameter = label.parentNode.id;
    // then because we have a string as an output to call the model in Defaults.js
    // we will call it with this line of code
    // var value = dictionary_to_consider[parameter]; (example: var value = filter_param[parameter])
    // important note: the value inside a dictionary and the id of the div in HTML must have the same name
    // second note: we need to find a way of finding the right dictionary to consider, we could use
    // a for loop that checks every dictionary and if the parameter is not in the dictionary it will
    // go to the next one until it finds the right one. This means that we need to put each dictionary into
    // an array and then loop through the array.

    // we split the id of the label to get the parameter name and the parameter type
    spl = label.parentNode.id.split(".")
    var def_value = 0;
    // we loop through the defaults.js file to get the default value of the parameter
    for (let i = 0; i < defaults.length; i++) {
        if(defaults[i] == spl[0]){
            for (const [key, value] of Object.entries(defaults[i + 1])){
                if(key == spl[1]){
                    def_value = value;
                }
            }
        }
   
    }
    // after we get the default value we set it to the label
    label.value = def_value;
    // if the knob is not null, we check if the knob is a frequency knob or not, then
    // we map the value of the parameter to an angle and set the knob to that angle
    if (knob != null){
        isLabelFrequency = label.parentNode.id.includes("freq") || label.parentNode.id.includes("cutoff") || label.parentNode.id.includes("rate");
        normalizedValue = normalizeToAngle(label, isLabelFrequency);
        // we set the rotation of that knob
        knob.style.rotate = normalizedValue + "deg";
    }
    // we resize the html to fit the value of the label
    resizeInput(label);
}

//update of knob values based on model values
function updateKnobView(kn){
    sw_o = document.getElementById("ch_osc")
    // sw_f = document.getElementById("ch_filter")
        
    // we get the knob and the label of the knob
    knob = kn.querySelector(".knob");
    label = kn.querySelector(".inputEl");
    // we split the id of the label to get the parameter name and the parameter type
    spl = label.parentNode.id.split(".")

    // we check if the parameter is a global parameter or not, for know we don't do anything
    if(spl[0] == "globals"){
            // console.log(spl[0]);
    } // if the parameter is not a global parameter we proceed
    else{
        // we get the steps of the current selected channel
        stp = seq.getChannelSteps();

        //check if adsr-ar switch has been changed previously for this step; if so updates view 
        // if(spl[1] == "decay" || spl[1] == "release"){
        //     if(sw_o.checked != stp[seq.getSelected()].getAdsrMix().is_ar){
        //         sw_o.checked = stp[seq.getSelected()].getAdsrMix().is_ar
                
        //         updateColorChannel(seq.getChannelIndex());
        //         //change switch color
        //         // if(sw_o.checked == false){sw_o.labels[0].style.background = "#45116c"}
        //         // else{sw_o.labels[0].style.background = "rgb(128, 128, 128)"}
                
        //         label.parentNode.parentNode.parentNode.children[1].children[0].classList.toggle("is_ar")
        //         label.parentNode.parentNode.parentNode.children[1].children[1].children[0].disabled = stp[seq.getSelected()].getAdsrMix().is_ar
        //         label.parentNode.parentNode.parentNode.children[3].children[0].classList.toggle("is_ar")
        //         label.parentNode.parentNode.parentNode.children[3].children[1].children[0].disabled = stp[seq.getSelected()].getAdsrMix().is_ar  
        //     }
        //     if(sw_f.checked != stp[seq.getSelected()].getAdsrFilter().is_ar){
        //         sw_f.checked = stp[seq.getSelected()].getAdsrFilter().is_ar

        //         updateColorChannel(seq.getChannelIndex());
        //         //change switch color
        //         // if(sw_f.checked == false){sw_f.labels[0].style.background = "#45116c"}
        //         // else{sw_f.labels[0].style.background = "rgb(128, 128, 128)"}
                
        //         label.parentNode.parentNode.parentNode.children[1].children[0].classList.toggle("is_ar")
        //         label.parentNode.parentNode.parentNode.children[1].children[1].children[0].disabled = stp[seq.getSelected()].getAdsrFilter().is_ar
        //         label.parentNode.parentNode.parentNode.children[3].children[0].classList.toggle("is_ar")
        //         label.parentNode.parentNode.parentNode.children[3].children[1].children[0].disabled = stp[seq.getSelected()].getAdsrFilter().is_ar  
        //     }
        // }
        // if(spl[0] == "adsr_filter"){
        //     // if(sw_f.checked != stp[seq.getSelected()].getAdsrFilter().is_ar){
        //     //     sw_f.checked = stp[seq.getSelected()].getAdsrFilter().is_ar
        //     //     label.parentNode.parentNode.parentNode.children[1].children[1].disabled = stp[seq.getSelected()].getAdsrFilter().is_ar
        //     //     label.parentNode.parentNode.parentNode.children[3].children[1].disabled = stp[seq.getSelected()].getAdsrFilter().is_ar  
        //     // }
        // }
        // console.log(stp)
        // we get the parameters of the current selected channel
        params = stp[seq.getSelected()].getParams();
        // we initialize the default value to set to the parameter to 0
        var def_value = 0;
        // we loop through the params of step file to get the current value of the parameter
        for (let i = 0; i < params.length; i++) {
            if(params[i] == spl[0]){
                for (const [key, value] of Object.entries(params[i + 1])){
                    if(key == spl[1]){
                        def_value = value;
                    }
                }
            }
    
        }
        // we set the value of the label to the default value
        label.value = def_value;

        // we map the value of the parameter to an angle and set the knob to that angle
        if (knob != null){
            isLabelFrequency = label.parentNode.id.includes("freq") || label.parentNode.id.includes("cutoff") || label.parentNode.id.includes("rate");
            normalizedValue = normalizeToAngle(label, isLabelFrequency);
            knob.style.rotate = normalizedValue + "deg";
        }
        // we resize the html to fit the value of the label and update the images of the waveforms
        updateWaveTypes();
        resizeInput(label);
    }
}
function updateWaveTypes(){
    // we get the steps of the current selected channel and its parameters
    var stp = seq.getChannelSteps();
    var params = stp[seq.getSelected()].getParams();
    // we get the images of the waveforms and set them to the right image
    var waveType = document.getElementById("oscImg");
    var file = "View/Images/" + params[1].type + ".png";
    waveType.src = file;

    var modType = document.getElementById("modImg");
    var file = "View/Images/" + params[1].modType + ".png";
    modType.src = file;
}

function normalizeToAngle(label, frequency=false){
    // as input we get the label and the boolean value that tells us if the knob is a frequency knob or not
    // we get maximum and minimum values of label and the current value of the label
    var max = parseFloat(label.max);
    var min = parseFloat(label.min);
    var value = parseFloat(label.value);
    // we map the value into the range from -170 to 170, which are the
    // minimum and maximum rotation of the knob. We will map it in a logarithmic way base 10
    // if the knob is a frequency knob, otherwise we will map it in a linear way
    if(frequency){
        var scaler = (Math.log2(max)-Math.log2(min)) / (maxAngle-minAngle); 
        var normalizedValue = -(Math.log2(value)-Math.log2(min)+scaler*minAngle)/scaler;
    }else{
        var normalizedValue = (value - min) * 340 / (max - min) - 170;
    }
    // we check if the value is in the range of the knob
    if(normalizedValue < -170){
        normalizedValue = -170;
    }else if(normalizedValue > 170){
        normalizedValue = 170;
    }
    // we return the angle that the knob must assume
    return normalizedValue;
}
function normalizeToValue(value, label, frequency=false){
    // as input we get the angle to map, the label and the boolean value that tells us if the knob
    // is a frequency knob or not.
    // Then we get maximum and minimum values of label and the current value of the label
    var max = parseFloat(label.max);
    var min = parseFloat(label.min);
    // we map the angle into the range from min to max, which are the
    // minimum and maximum values of the parameter. We will map it in a logarithmic way base 10
    // if the knob is a frequency knob, otherwise we will map it in a linear way
    if(frequency){
        var scaler = (Math.log2(max)-Math.log2(min)) / (maxAngle-minAngle); 
        var normalizedValue = 2**(Math.log2(min) + scaler * (-value - minAngle));
    }else{
        var normalizedValue = (value + 170) * (max - min) / 340 + min;
    }
    return normalizedValue;

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
function updateKnob(){
    // Here we update the knob when we press enter, blur means that we can't write on the input anymore
    labelToChange.blur();
    // we update the value of the parameter
    updateParamValue();
    // we resize the input to fit the value of the label
    resizeInput(labelToChange);
    // we apply the mapping to the angle of the knob
    isLabelFrequency = labelToChange.parentNode.id.includes("freq") || labelToChange.parentNode.id.includes("cutoff") || labelToChange.parentNode.id.includes("rate");
    normalizedValue = normalizeToAngle(labelToChange, isLabelFrequency);
    knob.style.rotate = normalizedValue + "deg";
}
function onMouseMove(event){
    // when we move the mouse after we clicked on the knob we update the value of the parameter
    // we check if the knob is of the type knob so it can rotate (thi is because we have other types of knobs
    // like the ones of the wave type)
    if(knob.classList.contains("knob") && !(knob.classList.contains("is_ar"))){
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
        if(label.step.length != 1){
            // if integer we round the value to the nearest integer
            label.value = normalizeToValue(finalAngleInDegrees, label, isLabelFrequency).toFixed(label.step.length - 2);
        } else{
            label.value = normalizeToValue(finalAngleInDegrees, label, isLabelFrequency).toFixed(0);
        }
        
        resizeInput(label);
        // we memorize the last vertical mouse position for the next time we move the mouse (after we onMouseUp will be updated on the next onMouseDown)
        prevMouseY = event.pageY;
    }
}

function onMouseUp(){ 
    // when we release the mouse button we update the value of the parameter
    updateParamValue()
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
    updateParamValue()
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
    else if(category == "filter"){
        var type = document.getElementById("filtType");
        var condition = (element) => element == type.value;

        var index = filterTypes.findIndex(condition);
        index = (index + 1) % 3;
        type.value = filterTypes[index].toLowerCase();
        var file = "View/Images/" + filterTypes[index] + ".png";
        document.getElementById("filtImg").src = file;
        
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
    updateParamValue()
}


function sw_ar(id_ck, id_d, id_s){
    var ck = document.getElementById(id_ck);
    var ids = [id_d, id_s];
    var lbl;
    var stp = seq.getChannelSteps()[seq.getSelected()];
    
    updateColorChannel(seq.getChannelIndex());
    
    if(ck.checked){
        ids.forEach(i => {
            lbl = document.getElementById(i);
            // console.log(lbl)
            lbl.children[0].disabled = true;
            lbl.parentNode.children[0].classList.toggle("is_ar");


            if(i.split(".")[0] == "adsr_mix"){
                // console.log(stp.getAdsrMix().decay)
                stp.getAdsrMix().is_ar = true;
                if(i.split(".")[1] == "decay"){
                    stp.getAdsrMix().tmp_decay = stp.getAdsrMix().decay;                    
                    stp.getAdsrMix().decay = 0;
                }
                else{
                    stp.getAdsrMix().tmp_sustain = stp.getAdsrMix().sustain;
                    stp.getAdsrMix().sustain = 0;
                }
                
                
            }
            else{ //if(i.split(".")[0] == "adsr_filter"){
                stp.getAdsrFilter().is_ar = true;
                if(i.split(".")[1] == "decay"){
                    stp.getAdsrFilter().tmp_decay = stp.getAdsrFilter().decay;
                    stp.getAdsrFilter().decay = 0;
                }
                else{
                    stp.getAdsrFilter().tmp_sustain = stp.getAdsrFilter().sustain;
                    stp.getAdsrFilter().sustain = 0;
                }
            }
            updateKnobView(lbl.parentNode)
        })
    }
    else{
        ids.forEach(i => {
            lbl = document.getElementById(i);
            // console.log(i.split("."))
            lbl.children[0].disabled = false;
            lbl.parentNode.children[0].classList.toggle("is_ar");

            if(i.split(".")[0] == "adsr_mix"){
                stp.getAdsrMix().is_ar = false;
                if(i.split(".")[1] == "decay"){
                    stp.getAdsrMix().decay = stp.getAdsrMix().tmp_decay;
                    stp.getAdsrMix().tmp_decay = 0;
                }
                else{
                    stp.getAdsrMix().sustain = stp.getAdsrMix().tmp_sustain ;
                    stp.getAdsrMix().tmp_sustain = 0;
                }
                
            }
            else{
                stp.getAdsrFilter().is_ar = false;
                if(i.split(".")[1] == "decay"){
                    stp.getAdsrFilter().decay = stp.getAdsrFilter().tmp_decay;
                    stp.getAdsrFilter().tmp_decay = 0;
                }
                else{
                    stp.getAdsrFilter().sustain = stp.getAdsrFilter().tmp_sustain ;
                    stp.getAdsrFilter().tmp_sustain = 0;
                }
            }
            updateKnobView(lbl.parentNode)
        }) 
    }
    // console.log(lbl.parentNode)
    // updateKnobView(lbl.parentNode)
}