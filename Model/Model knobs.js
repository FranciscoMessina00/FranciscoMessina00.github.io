
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
var volumes;
var label;
var labelToChange;
var knobPositionY;
var prevMouseY;
var mouseY;
var knobCenterY;
var oppositeSide;
var getRadiansInDegrees;
var finalAngleInDegrees;
var minAngle = 170; 
var maxAngle = -170;
var waveTypes = ["sine", "triangle", "square", "sawtooth"];
var filterTypes = ["lowpass", "highpass", "bandpass"];

function updateParamValue(){
    // console.log(quant_f[1]['note']);

    spl = label.parentNode.id.split(".");
    var lbl_value = label.value;
    if (spl[0] == "globals"){
        tmp = {...globals}
        for (const [key, value] of Object.entries(tmp)){
            if(key == spl[1]){
                tmp[key] = lbl_value;
            }
            if(key == "bpm"){
                Tone.Transport.bpm.value = tmp[key];
            }
        }
        seq.setGlobals(tmp);
    } else if (spl[0] == "flanger_param"){
        tmp = flanger_param
        for (const [key, value] of Object.entries(tmp)){
            if(key == spl[1]){
                tmp[key] = lbl_value;
            }
        }
        seq.getCurrentStep().setFlanger(tmp);
        updateFlanger();
    }else if(spl[0] == "fold_param"){
        tmp = fold_param
        for (const [key, value] of Object.entries(tmp)){
            if(key == spl[1]){
                tmp[key] = lbl_value;
            }
        }
        seq.getCurrentStep().setFolder(tmp);
        updateFolder();
    }else{
        var stp = seq.getChannelSteps();
        // console.log(stp[seq.getSelected()])

        var params = stp[seq.getSelected()].getParams();
        if(!seq.isPlaying()){
            updateSingleSynthParams()
        }
        //check if quantization is actived; if so passes label's corresponding value
        if(spl[0] == "osc_param" && spl[1] == "freq"){ 
            var ck = knob.parentNode.children[1].children[0]
            if(ck.checked){
                var i = 0
                while (quant_f[i]['note'] != lbl_value) {
                    i++;
                }
                lbl_value = quant_f[i]['freq']
            }
        }
        
        
        
        
        //console.log(spl)



        //console.log(def_value);

        for (let i = 0; i < params.length; i++) {
            if(params[i] == spl[0]){
                // console.log("yao");
                tmp_dict = params[i+1];
                for (var [key, value] of Object.entries(params[i + 1])){
                    if(key == spl[1]){
                        
                        tmp_dict[key] = lbl_value;
                        params[i+1] = tmp_dict;
                        //console.log(tmp_dict);
                    }
                }
            }
    
        }

        stp[seq.getSelected()].setParams(params)
    }
    
}


//function to copy current view value to all channel's steps
function copyToAll(){
    var steps = seq.getChannelSteps();
    var current_pars = steps[seq.getSelected()].getParams();
    
    steps.forEach(e => {    
        e.setParams(current_pars)
        // e.resetParams()
    });
    // knobs.forEach(kn =>{updateKnobView(kn)})
    // updateParamValue()
    drawSequencer()
}