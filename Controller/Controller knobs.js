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

detectKnob();
setInitialKnobValues();