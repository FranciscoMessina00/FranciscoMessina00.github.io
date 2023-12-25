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

}

detectKnob();
setInitialKnobValues();