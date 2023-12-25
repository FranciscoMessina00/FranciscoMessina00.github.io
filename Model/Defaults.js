var globals = {
    bpm: 120,
}

osc_param = {
    freq : 440,  
    type : 'sine', 
    modType: 'sine',
    harm : 1.3, 
    mod : 1,
    LFOamt: 50,
}
// var global = {
//     glide : 0,
//     vibrato : 0,
//     position: 0,
//     //LFOpos: 1,
// }

var filter_param = {
    cutoff: 1000, //20-20000 Hz
    resonance : 0, //0-10
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 0, //0-20000
    LFO_amount : 0, //0-10000
}

var LFO = {
    waveform : 'sine',
    rate : 2, //0.1-20000 Hz
    sync : false,
}

var adsr_mix = {
    is_ar : false,
    attack : 200,
    decay : 200,
    sustain: 0.5,
    release : 200,
    tmp_decay : 0,
    tmp_sustain : 0
}

var adsr_filter = {
    is_ar : false,
    attack : 500,
    decay : 600,
    sustain: 0.5,
    release : 500,
    tmp_decay : 0,
    tmp_sustain : 0
}

var flanger_param = {
    rate : 1,
    type : 'sine',
    depth: 0.003,
    feedback : 0.7,
    width : 0.5,
    dw: 0.5,
    color: 1000
}

defaults = ["globals", globals, "osc_param", osc_param, "filter_param", filter_param, "LFO", LFO, "adsr_mix", adsr_mix, "adsr_filter", adsr_filter,  
"flanger_param", flanger_param];