Tone.setContext(new Tone.Context({ latencyHint : "playback" }))
Tone.context.lookAhead = 0.2;

function updateSynthParams(playing=seq.getStepPlaying()){
    var chn = seq.getAllSteps();
    for(var i = 0; i < chn.length; i++){
        var stp = chn[i].getSteps()[playing];
        if(stp.toPlay == 1){
            if(chn[i].getType() == "melody"){
                updateOscillator(chn[i].getOscillator(), stp.osc_param);
                updateEnv(chn[i].getAmpEnv(), stp.adsr_mix);
                updateLFO(chn[i].getLFO(), stp.LFO);
            }else{
                if(stp.kick_param.volume > 0){
                    updateKick(chn[i].getKick(), stp.kick_param);
                }
                if(stp.snare_param.volume > 0){
                    updateSnare(chn[i].getSnare(), stp.snare_param);
                }
                if(stp.hat_param.volume > 0){
                    updateHat(chn[i].getHat(), stp.hat_param);
                }
                if(stp.tom_param.volume > 0){
                    updateTom(chn[i].getTom(), stp.tom_param);
                }
            }
            
        }
    }
}
function updateSingleSynthParams(playing=seq.getSelected()){
    var chn = seq.getChannel();
    var stp = chn.getSteps()[playing];
    if(chn.getType() == "melody"){
        updateOscillator(chn.getOscillator(), stp.osc_param);
        updateEnv(chn.getAmpEnv(), stp.adsr_mix);
        updateLFO(chn.getLFO(), stp.LFO);
    }else{
        updateKick(chn.getKick(), stp.kick_param);
        updateSnare(chn.getSnare(), stp.snare_param);
        updateHat(chn.getHat(), stp.hat_param);
        updateTom(chn.getTom(), stp.tom_param);
    }
    drawSingleStep(seq.getSelected());
}

function updateOscillator(osc, par){

    osc.fmOsc.set({
        frequency: par.freq,
        type: par.type,
        modulationType: par.modType,
        harmonicity: par.harm,
        modulationIndex: par.mod,
    })
    osc.LFOModFm.set({
        gain: par.LFOamt
    })
    osc.volume.set({
        gain: par.volume
    })
}

function updateEnv(env, par){

    env.set({
        attack: par.attack/1000,
        decay: par.decay/1000,
        sustain: par.sustain,
        release: par.release/1000
    })
}

// function updateFilter(fil, par){
//     // fil.set({
//     //     frequency : par.cutoff,
//     //     Q : par.resonance,
//     //     type : par.type
//     // })
//     fil.filter.set({
//         frequency : par.cutoff,
//         Q : par.resonance,
//         type : par.type
//     })
//     fil.envAmount.set({gain : par.env_amount});
//     fil.LFOAmt.set({gain : par.LFO_amount});
// }

function updateLFO(lfo, par){

    lfo.set({
        frequency: par.rate,
        waveform: par.waveform
    })
}
function updateKick(kick, par){
    kick.o.set({
        frequency: par.pitch,
    })
    kick.amp.set({
        release: par.r/1000,
    })
    kick.freqEnv.set({
        release: par.fr/1000,
    })
    kick.volume.set({
        gain: par.volume,
    })
    kick.pan.set({
        pan: par.position,
    })
    kick.freqEnvAmt.set({
        gain: par.sweep,
    })
}
function updateSnare(snare, par){
    snare.tonal.set({
        frequency: par.pitch,
    })
    snare.amp.set({
        release: par.r/1000,
    })
    snare.freqEnv.set({
        release: par.fr/1000,
    })
    snare.volume.set({
        gain: par.volume,
    })
    snare.pan.set({
        pan: par.position,
    })
    snare.freqEnvAmt.set({
        gain: par.sweep,
    })
    snare.noise.set({
        type: colorNoise(par.color),
    })
    snare.balance.set({
        fade: par.balance,
    })
}
function updateHat(hat, par){
    hat.amp.set({
        release: par.r/1000,
    })
    hat.volume.set({
        gain: par.volume,
    })
    hat.pan.set({
        pan: par.position,
    })
    hat.filter.set({
        frequency: par.cutoff,
    })
}
function updateTom(tom, par){
    tom.sine.set({
        frequency: par.hiPitch,
    })
    tom.amp.set({
        release: par.r/1000,
    })
    tom.volume.set({
        gain: par.volume,
    })
    tom.pan.set({
        pan: par.position,
    })
    tom.color.set({
        fade: par.color,
    })

}
function updateFlanger(){
    var flanger_par = seq.getCurrentStep().getFlanger();
    var flanger = seq.getChannel().getFlanger();
    flanger.LFOl.set({
        frequency: flanger_par.freq,
        type: flanger_par.type,
    })
    flanger.LFOr.set({
        frequency: flanger_par.freq + flanger_par.stereo,
        type: flanger_par.type,
    })
    flanger.modl.set({
        gain: flanger_par.width,
    })
    flanger.modr.set({
        gain: flanger_par.width - flanger_param.stereo*0.005,
    })
    flanger.dlyr.set({
        delayTime: 0.015 - flanger_param.stereo*0.005,
    })
    flanger.feedbackl.set({
        gain: flanger_par.feedback,
    })
    flanger.feedbackr.set({
        gain: flanger_par.feedback,
    })
    flanger.range_depthl.set({
        gain: flanger_par.depth,
    })
    flanger.range_depthr.set({
        gain: flanger_par.depth,
    })
    flanger.dryWet.set({
        fade: flanger_par.dw,
    })
    flanger.colorl.set({
        fade: flanger_par.color,
    })
    flanger.colorr.set({
        fade: flanger_par.color,
    })
    flanger.overdrivel.setMap(function (val) {
        var amt = 3 - flanger_param.feedback;  // Bisogna abbassare l'amt di distorsione perché con valori di feedback troppo alti si rischia l'auto-oscillazione del flanger. Il carattere della distorsione dipende tantissimo dal feedback e non solo per l'operazione di sottrazione ma soprattutto per come questo cambia il flusso del segnale audio
        return Math.tanh(2^(amt*val));  //tanh e 2^val sono funzioni utilizzate nel design di distorsori. Io le ho combinate, se volete sperimentate altre funzioni.
        });
    flanger.overdriver.setMap(function (val) {
        var amt = 3 - flanger_param.feedback;  // Bisogna abbassare l'amt di distorsione perché con valori di feedback troppo alti si rischia l'auto-oscillazione del flanger. Il carattere della distorsione dipende tantissimo dal feedback e non solo per l'operazione di sottrazione ma soprattutto per come questo cambia il flusso del segnale audio
        return Math.tanh(2^(amt*val));  //tanh e 2^val sono funzioni utilizzate nel design di distorsori. Io le ho combinate, se volete sperimentate altre funzioni.
        });
}
function updateFolder(){
    var folder_par = seq.getCurrentStep().getFolder();
    var folder = seq.getChannel().getFolder();
    seq.getChannel().resetFolder();
    seq.getChannel().resetDist();
    folder.drywetBlock.set({
        fade: folder_par.drywet,
    })
}