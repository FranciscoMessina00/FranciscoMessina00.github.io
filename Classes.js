class Sequencer{
    constructor(){
        this.channel = 0;
        this.globals = {...globals};
        this.steps = [
                        new Channel(),
                        new Channel(),
                        // new Channel(),
                        // new Channel()
                    ];
        this.selected = 0;
        this.playing = false;
        this.stepPlaying = -1;
        this.nChannels = this.steps.length;
    }
    
    // getters

    getGlobals(){
        return this.globals.bpm;
    }
    getChannelIndex(){
        return this.channel;
    }
    getChannel(){
        return this.steps[this.channel];
    }
    getChannelSteps(){
        return this.steps[this.channel].getSteps();
    }
    getAllSteps(){
        return this.steps;
    }
    getSelected(){
        return this.selected;
    }
    getStepPlaying(){
        return this.stepPlaying;
    }
    getNChannels(){
        return this.nChannels;
    }
    //setters
    setGlobals(value){
        this.globals.bpm = value;
    }
    setChannel(channel){
        if(channel < 0){
            this.channel = 3;
        } else if(channel > 3){
            this.channel = 0;
        } else {
            this.channel = channel;
        }
    }
    setSelected(selected){
        this.selected = selected;
    }
    setStepPlaying(step){
        this.stepPlaying = step;
    }
    
    
    play(){
        this.playing = true;
    }
    stop(){
        this.playing = false;
    }
    isPlaying(){
        return this.playing;
    }
    updateStep(){
        if(this.playing){
            this.stepPlaying = (this.stepPlaying + 1) % 16;
        }
    }
    triggerStep(step){
        var curr_channel = this.steps[this.channel].getSteps()
        curr_channel[step].setToPlay(1-curr_channel[step].getToPlay());  
    }
    
}

class Channel{
    constructor(){
        this.steps = [];
        for (let i = 0; i <= 15; i++) {
            this.steps[i] = new Step();           
        }
        this.limiter = new Tone.Limiter(-1);
        this.limiter.connect(Tone.Destination);
        // Parameters for the synth
        // this.filter = Synth.createFilter(filter_param, adsr_filter);
        this.ampEnv = Synth.createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
        this.oscillator = Synth.createOscillator(osc_param);
        this.LFO = Synth.createLFO(LFO);
        // Connections
        this.oscillator.fmOsc.chain(this.ampEnv, this.limiter);
        // this.filter.env.chain(this.filter.envAmount, this.filter.filter.frequency);
        // this.LFO.chain(this.filter.LFOAmt, this.filter.filter.frequency);
        this.LFO.chain(this.oscillator.LFOModFm, this.oscillator.fmOsc.modulationIndex);
        this.LFO.start()
        // this.instrument = new Tone.Synth().toDestination();
        this.oscillator.fmOsc.start();
    }

    getOscillator(){
        return this.oscillator;
    }
    getAmpEnv(){
        return this.ampEnv;
    }
    // getFilter(){
    //     return this.filter;
    // }
    // getFilterEnv(){
    //     return this.filter.env;
    // }
    getLFO(){
        return this.LFO;
    }
    
    getSteps(){
        return this.steps;
    }
    // playChannel(note, time){
    //     this.steps[seq.getStepPlaying()].playSound(note, time, this.ampEnv);     
    // }
    playChannel(time){
        if(seq.getStepPlaying() != -1){
            this.steps[seq.getStepPlaying()].playSound(time, this.ampEnv, this.oscillator.fmOsc);
        }
    }
}

class Step{
    constructor(){
        this.toPlay = 0;
        this.osc_param = {...osc_param};
        // this.filter_param = {...filter_param};
        this.LFO = {...LFO};
        this.adsr_mix = {...adsr_mix};
        // this.adsr_filter = {...adsr_filter};
        this.flanger_param = {...flanger_param};
        this.params = ["osc_param", this.osc_param, "LFO", this.LFO, "adsr_mix", this.adsr_mix, "flanger_param", this.flanger_param];
        
    }

    playSound(time, ampEnv, osc){
        if(this.toPlay == 1){
            Tone.Transport.schedule(updateSynthParams(), time);
            ampEnv.triggerAttackRelease(ampEnv.attack, time + 0.1);
            // filter.triggerAttackRelease(filter.attack, time + 0.05);
        }
    }
    //getters
    getToPlay(){
        return this.toPlay;
    }
    getOscParam(){
        return this.osc_param;
    }
    // getFilterParam(){
    //     return this.filter_param;
    // }
    getLFO(){
        return this.LFO;
    }
    getAdsrMix(){
        return this.adsr_mix;
    }
    // getAdsrFilter(){
    //     return this.adsr_filter;
    // }
    getFlangerParam(){
        return this.flanger_param;
    }
    getParams(){
        return this.params; 
    }
    
    //setters
    setToPlay(value){
        // console.log("hello!")
        this.toPlay = value;
    }
    setOscParam(value){
        this.osc_param = value;
    }
    // setFilterParam(value){
    //     this.filter_param = value;
    // }
    setLFO(value){
        this.LFO = value;
    }
    setAdsrMix(value){
        this.adsr_mix = value;
    }
    // setAdsrFilter(value){
    //     this.adsr_filter = value;
    // }
    setFlangerParam(value){
        this.flanger_param = value;
    }
    setParams(value){
        this.params = value;
    }
}

class Synth{
    static createAmpEnv(a, d, s, r) { 
        var ampEnv = new Tone.AmplitudeEnvelope();
        ampEnv.set({
            attack: a/1000,
            decay: d/1000,
            sustain: s,
            release: r/1000,
        })               
        return ampEnv;     
    }
    
    static createOscillator(osc_param) {
        var fmOsc = new Tone.FMOscillator();
        var LFOModFm = new Tone.Gain(osc_param.LFOamt);
        fmOsc.set({
            frequency: osc_param.freq,
            type: osc_param.type,
            modulationType: osc_param.modType,
            harmonicity: osc_param.harm,
            modulationIndex: osc_param.mod,
        })
        return {
            fmOsc: fmOsc,
            LFOModFm: LFOModFm};
    }
    
    // static createFilter(filter_param, adsr_filter){
    //     var filter = new Tone.Filter()
    //     filter.set({
    //         frequency : filter_param.cutoff,
    //         Q : filter_param.resonance,
    //         type : filter_param.type,
    //     })
    //     var env = Synth.createFilterEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
    //     var envAmount = new Tone.Gain(filter_param.env_amount);
    //     var LFOAmt = new Tone.Gain(filter_param.LFO_amount);
        
    //     return {
    //         filter: filter,
    //         env: env, 
    //         envAmount: envAmount, 
    //         LFOAmt: LFOAmt};
    // }
    
    // static createFilterEnv(a, d, s, r) {
    //     var FilterEnv = new Tone.Envelope({
    //     attack: a/1000,
    //     decay: d/1000,
    //     sustain: s,
    //     release: r/1000,
    //     });
    //     return FilterEnv;
    // }
    
    static createLFO(LFO) {
        var LFO = new Tone.Oscillator({
            frequency: LFO.rate,
            waveform: LFO.waveform,
        });
        return LFO;
    }
}

class Player{
    constructor(){
        
    }
    start(sequencer){
        sequencer.play();
        Tone.start();
        Tone.Transport.start();
    }
    stop(sequencer){
        Tone.Transport.stop();
        sequencer.stop();
        sequencer.setStepPlaying(-1);
        changeBorders();
    }
    playSound(time){
        // var notes = ["C4", "E4", "G4", "B4"];
        var channels = seq.getAllSteps();
        for (var i = 0; i < seq.getNChannels(); i++) {
            // channels[i].playChannel(notes[i], time);
            channels[i].playChannel(time);
        }
        changeBorders();
    }
}