function updateColorChannel(channel){
    switch(channel){
        case 0:
            document.getElementById("wholeContainer").style.backgroundColor = "#3C3C48";
            document.querySelectorAll(".dot").forEach(el => el.style.backgroundColor = "#44116C");
            document.querySelectorAll("#play").forEach(el => el.style.borderLeftColor = "#44116C");
            document.querySelectorAll("#stop").forEach(el => el.style.backgroundColor = "#44116C");
            document.querySelectorAll(".knob").forEach(el => el.style.borderColor = "#44116C");
            document.querySelectorAll(".control").forEach(el => el.style.borderColor = "#44116C");
            document.querySelectorAll("label").forEach(el => el.style.backgroundColor = "#44116C");
            document.querySelectorAll("input:checked + label").forEach(el => el.style.backgroundColor = "grey");
            document.querySelectorAll(".blockSection").forEach(el => el.style.borderColor = "#44116C");
            document.querySelectorAll(".image").forEach(el => el.classList.remove("red"));
            document.querySelectorAll(".image").forEach(el => el.classList.add("violet"));
            colorDodOnOut = '#8951FF';
            colorDodOnIn = '#BE6AFF';
            strokeSelected = '#5c1001'

            document.getElementById("oscillator").style.display = "block";
            document.getElementById("effects").style.display = "block";
            document.getElementById("drumSection").style.display = "none";
            break;
        case 1:
            document.getElementById("wholeContainer").style.backgroundColor = "#6D1111";
            document.querySelectorAll(".dot").forEach(el => el.style.backgroundColor = "#580C0C");
            document.querySelectorAll("#play").forEach(el => el.style.borderLeftColor = "#580C0C");
            document.querySelectorAll("#stop").forEach(el => el.style.backgroundColor = "#580C0C");
            document.querySelectorAll(".knob").forEach(el => el.style.borderColor = "#580C0C");
            document.querySelectorAll(".control").forEach(el => el.style.borderColor = "#580C0C");
            document.querySelectorAll("label").forEach(el => el.style.backgroundColor = "#580C0C");
            document.querySelectorAll("input:checked + label").forEach(el => el.style.backgroundColor = "grey");
            document.querySelectorAll(".blockSection").forEach(el => el.style.borderColor = "#580C0C");
            document.querySelectorAll(".image").forEach(el => el.classList.add("red"));
            document.querySelectorAll(".image").forEach(el => el.classList.remove("violet"));
            colorDodOnOut = '#FF5151';
            colorDodOnIn = '#FF6A6A';
            strokeSelected = '#013c5c'

            document.getElementById("oscillator").style.display = "none";
            document.getElementById("effects").style.display = "none";
            document.getElementById("drumSection").style.display = "flex";
            break;
    }
    drawSequencer();
}

function visualizeChannels(){
    const ch1Div = document.getElementById('ch1');  
    ch1Div.style.display = 'none';

    const container = document.getElementById('containerSequencer');
    const channelDivs = document.querySelectorAll('.separationSteps');
  
    channelDivs.forEach(function(div) {
        if (div.id !== 'canvasContainer') {
            div.addEventListener('click', function() {
                // Show all channels except the canvasContainer
                channelDivs.forEach(function(ch) {
                    if (ch.id !== 'canvasContainer') {
                    ch.style.display = 'block';
                    }
                });

                // Detach canvasContainer
                const canvasContainer = document.getElementById('canvasContainer');
                const detachedCanvas = container.removeChild(canvasContainer);
                
                // Hide the clicked channel
                div.style.display = 'none';

                // Reinsert canvasContainer in place of hidden channel
                const clickedIndex = Array.from(channelDivs).indexOf(div);
                container.insertBefore(detachedCanvas, container.children[clickedIndex]);
                // console.log(clickedIndex)
                var canvCont = document.getElementById("canvasContainer");
                canvCont.style.borderBottomRightRadius = "0px";
                canvCont.style.borderBottomLeftRadius = "0px";
                switch(clickedIndex){
                    case 0:
                        seq.setChannel(0);
                        canvCont.style.backgroundColor = updateColorChannel(seq.getChannelIndex());
                        break;
                    case 2:
                        seq.setChannel(1);
                        canvCont.style.backgroundColor = updateColorChannel(seq.getChannelIndex());
                        canvCont.style.borderBottomRightRadius = "10px";
                        canvCont.style.borderBottomLeftRadius = "10px";
                        break;
                }
                // changeBorders();
                knobs.forEach(kn => updateKnobView(kn));
            });
        }
    });
};

function changeBorders(){
    // var allSteps = seq.getAllSteps();
    var stepPlaying = seq.getStepPlaying();
    // console.log("hello", stepPlaying);
    var prevStep = (16 + stepPlaying - 1) % 16;
    for(var i = 0; i < seq.getNChannels(); i++){
        var childrenList = document.getElementById("ch" + (i+1)).children;
        childrenList[0].children[prevStep].classList.remove("goldStep");
        if(seq.isPlaying()){
            childrenList[0].children[stepPlaying].classList.add("goldStep");
        }else{
            childrenList[0].children[stepPlaying].classList.remove("goldStep");
        }
    }
    drawSingleStep(stepPlaying);
    drawSingleStep(prevStep);
}
function toggleRed(j){
    var childrenList = document.getElementById("ch" + (seq.getChannelIndex() +1)).children;
    childrenList[0].children[j].classList.toggle("redStep");
}