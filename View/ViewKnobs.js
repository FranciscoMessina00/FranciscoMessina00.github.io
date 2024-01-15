function setInitialKnobValues(){
    // We get all the knobs in the page and set their values to the default values
    knobs.forEach(kn => setSingleKnobValues(kn));
}

//init of knobs based on Default.js values
function setSingleKnobValues(kn){
    knob = kn.querySelector(".knob");
    label = kn.querySelector(".inputEl");

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
    // sw_o = document.getElementById("ch_osc")
    // sw_f = document.getElementById("ch_filter")
        
    // we get the knob and the label of the knob
    knob = kn.querySelector(".knob");
    label = kn.querySelector(".inputEl");
    // we split the id of the label to get the parameter name and the parameter type
    var spl = label.parentNode.id.split(".")
    var stp = seq.getChannelSteps();
    var params = stp[seq.getSelected()].getParams();

    
    // we check if the parameter is a global parameter or not, for know we don't do anything
    if(spl[0] == "globals"){
            // console.log(spl[0]);
    }else if(seq.getChannelIndex() == 0 &&(spl[0] == "osc_param")&&(spl[1] == "freq")){
        // console.log(seq.getChannelIndex())
        var quant = stp[seq.getSelected()].getOscParam().quant
        var ck = knob.parentNode.children[1].children[0]

        isLabelFrequency = true;
        if(quant){
            var i = 0
            while (quant_f[i]['freq'] != params[1].freq) {
                i++;
            }
            
            label.value = quant_f[i]['freq'];
            normalizedValue = normalizeToAngle(label, isLabelFrequency);
            knob.style.rotate = normalizedValue + "deg";
            label.type = 'text';
            label.value = quant_f[i]['note']
            ck.checked = true;
            label.disabled = true;
            var type = document.getElementById("typeOfValue");
            type.innerHTML = "Note";
            var udm = document.getElementById("unitOfMeasure");
            udm.innerHTML = "";
            // drawSequencer()
        }else{
            label.type = 'number';
            label.value = params[1].freq
            ck.checked = false
            label.disabled = false;
            normalizedValue = normalizeToAngle(label, isLabelFrequency);
            knob.style.rotate = normalizedValue + "deg";
            var type = document.getElementById("typeOfValue");
            type.innerHTML = "Frequency";
            var udm = document.getElementById("unitOfMeasure");
            udm.innerHTML = "Hz";
            labelToChange = label;
            // updateKnob()
            
        }
        updateColorChannel(seq.getChannelIndex());
        resizeInput(label)
    } // if the parameter is not a global parameter we proceed
    else{
        // we get the steps of the current selected channel
        
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
        if(seq.getChannelIndex() != 1){
            // we update the images of the waveforms only if we are in the oscillator channel
            updateWaveTypes();
        }
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

    var flangType = document.getElementById("flangImg");
    var file = "View/Images/" + params[7].type + ".png";
    flangType.src = file;
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
function updateKnob(){
    // Here we update the knob when we press enter, blur means that we can't write on the input anymore
    labelToChange.blur();
    if(parseFloat(labelToChange.value) > labelToChange.max) labelToChange.value = labelToChange.max;
    if(parseFloat(labelToChange.value) < labelToChange.min) labelToChange.value = labelToChange.min;
    // we update the value of the parameter
    updateParamValue();
    // we resize the input to fit the value of the label
    resizeInput(labelToChange);
    // we apply the mapping to the angle of the knob
    isLabelFrequency = labelToChange.parentNode.id.includes("freq") || labelToChange.parentNode.id.includes("cutoff") || labelToChange.parentNode.id.includes("rate");
    normalizedValue = normalizeToAngle(labelToChange, isLabelFrequency);
    knob.style.rotate = normalizedValue + "deg";
}