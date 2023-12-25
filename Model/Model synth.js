// const c = new AudioContext();
// c.resume();
Tone.setContext(new Tone.Context({ latencyHint : "playback" }))
Tone.context.lookAhead = 0.2;

// var osc_param = {
//     freq : 440, 
//     type : "sine", 
//     modtype: "sine", 
//     harm : 1.3, 
//     mod : 1,
//     LFOamt: 1000,
// }
// var global = {
//     glide : 0,
//     pwm : 0,
//     vibrato : 0,
//     position: 0,
//     //LFOpos: 1,
// }

// var filter_param = {
//     cutoff: 3000,
//     resonance : 0,
//     // keyboard_tracking : 0,
//     type : 'lowpass',
//     env_amount : 0,
//     LFO_amount : 0,
// }

// var LFO = {
//     waveform : 'sine',
//     rate : 2,
//     sync : false,
// }

// var adsr_mix = {
//     is_ar : false,
//     attack : 0.5,
//     decay : 0.5,
//     sustain: 0.5,
//     release : 2 
// }

// var adsr_filter = {
//     is_ar : false,
//     attack : 1,
//     decay : 0.6,
//     sustain: 0.5,
//     release : 1
// }
// Parameters for the synth
// var filter = Synth.createFilter(filter_param, adsr_filter);
// var ampEnv = Synth.createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
// var oscillator = Synth.createOscillator(osc_param);
// var LFO = Synth.createLFO(LFO);
// // Connections
// oscillator.fmOsc.chain(ampEnv, filter.filter, Tone.Destination);
// filter.env.chain(filter.envAmount, filter.filter.frequency);
// LFO.chain(filter.LFOAmt, filter.filter.frequency);
// LFO.chain(oscillator.LFOModFm, oscillator.fmOsc.modulationIndex);
// // Start
// LFO.start();
// oscillator.fmOsc.start();

function updateSynthParams(){
    var playing = seq.getStepPlaying();
    var chn = seq.getAllSteps();
    for(var i = 0; i < chn.length; i++){
        var stp = chn[i].getSteps()[playing];
        if(stp.toPlay == 1){
            updateOscillator(chn[i].getOscillator(), stp.osc_param);
            updateEnv(chn[i].getAmpEnv(), stp.adsr_mix);
            // updateFilter(chn[i].getFilter(), stp.filter_param);
            // updateEnv(chn[i].getFilterEnv(), stp.adsr_filter);
            updateLFO(chn[i].getLFO(), stp.LFO);
        }
    }
}

function updateOscillator(osc, par){

    osc.fmOsc.set({
        frequency: par.freq,
        type: par.type,
        modulationType: par.modType,
        harmonicity: par.harm,
        modulationIndex: par.mod
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

function updateFilter(fil, par){
    // fil.set({
    //     frequency : par.cutoff,
    //     Q : par.resonance,
    //     type : par.type
    // })
    fil.filter.set({
        frequency : par.cutoff,
        Q : par.resonance,
        type : par.type
    })
    fil.envAmount.set({gain : par.env_amount});
    fil.LFOAmt.set({gain : par.LFO_amount});
}

function updateLFO(lfo, par){

    lfo.set({
        frequency: par.rate,
        waveform: par.waveform
    })
}