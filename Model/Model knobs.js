
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
var minAngle = 170; 
var maxAngle = -170;
var waveTypes = ["sine", "square", "triangle", "sawtooth"];
var filterTypes = ["lowpass", "highpass", "bandpass"];

function updateParamValue(){
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
    }else{
        stp = seq.getChannelSteps();
        // console.log(stp[seq.getSelected()])

        params = stp[seq.getSelected()].getParams();

        
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