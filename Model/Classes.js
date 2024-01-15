class Sequencer{
    constructor(){
        this.channel = 0;
        this.globals = {...globals};
        this.steps = [
                        new Channel('melody'),
                        new Channel('perc'),
                        // new Channel(),
                        // new Channel()
                    ];
        this.selected = 0;
        this.playing = false;
        this.stepPlaying = 0;
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
    getIndexStep(index){
        return this.steps[this.channel].getSteps()[index];
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
    getCurrentStep(){
        return this.steps[this.channel].getSteps()[this.stepPlaying];
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
    constructor(type){
        this.type = type;
        this.steps = [];
        for (let i = 0; i <= 15; i++) {
            this.steps[i] = new Step(this.type);           
        }
        this.limiter = new Tone.Limiter(-1);
        this.limiter.connect(Tone.Destination);
        // Parameters for the synth
        // this.filter = Synth.createFilter(filter_param, adsr_filter);

        if(this.type == 'melody'){
            this.ampEnv = Synth.createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
            this.oscillator = Synth.createOscillator(osc_param);
            this.LFO = Synth.createLFO(LFO);
            this.flanger = Synth.createFlanger(flanger_param);
            this.folder = Synth.brutalize(this.ampEnv, fold_param.fold_amt, fold_param.dist_amt, fold_param.drywet);
            // Connections
            this.oscillator.fmOsc.connect(this.ampEnv);
            this.folder.drywetBlock.chain(this.oscillator.volume, this.oscillator.pan, this.flanger.s);
            this.oscillator.pan.connect(this.flanger.dryWet.a);
            this.flanger.dryWet.connect(this.limiter);
            // this.filter.env.chain(this.filter.envAmount, this.filter.filter.frequency);
            // this.LFO.chain(this.filter.LFOAmt, this.filter.filter.frequency);
            this.LFO.chain(this.oscillator.LFOModFm, this.oscillator.fmOsc.modulationIndex);
            this.LFO.start()
            this.oscillator.fmOsc.start();
        } else {
            this.kick = Synth.createKick(kick_param);
            this.snare = Synth.createSnare(snare_param);
            this.hat = Synth.createHat(hat_param);
            this.tom = Synth.createTom(tom_param);

            this.kick.pan.connect(Tone.Destination);
            this.snare.pan.connect(Tone.Destination);
            this.hat.pan.connect(Tone.Destination);
            this.tom.pan.connect(Tone.Destination);

        }
    }

    getOscillator(){
        return this.oscillator;
    }
    getAmpEnv(){
        return this.ampEnv;
    }
    getType(){
        return this.type;
    }
    getLFO(){
        return this.LFO;
    }
    getKick(){
        return this.kick;
    }
    getSnare(){
        return this.snare;
    }
    getHat(){
        return this.hat;
    }
    getTom(){
        return this.tom;
    }
    getFlanger(){
        return this.flanger;
    }
    getFolder(){
        return this.folder;
    }
    getSteps(){
        return this.steps;
    }
    resetFolder(){
        this.folder.folder.setMap(
            function(val){
                return Synth.folding(fold_param.fold_amt, val);
            }
        );    
    }
    resetDist(){
        this.folder.dist.setMap(
            function (val) {
            
                var amt = fold_param.dist_amt;
            
                return Math.tanh(val*amt);    
            }
        );    
    }
    playChannel(time=0, singlePlay=false){
        if(seq.isPlaying() || singlePlay){
            var stepToPlay = seq.getStepPlaying();
            if(singlePlay){
                stepToPlay = seq.getSelected();
            }
            if(this.type == 'melody'){
                this.steps[stepToPlay].playSound(time, this.ampEnv, singlePlay);
            }else{                
                if(this.steps[stepToPlay].getKick().volume > 0){
                    this.steps[stepToPlay].playSound(time, this.kick.amp, singlePlay);
                    this.steps[stepToPlay].playSound(time, this.kick.freqEnv, singlePlay); 
                }
                if(this.steps[stepToPlay].getSnare().volume > 0){
                    this.steps[stepToPlay].playSound(time, this.snare.amp, singlePlay);
                    this.steps[stepToPlay].playSound(time, this.snare.freqEnv, singlePlay);
                }
                if(this.steps[stepToPlay].getHat().volume > 0){
                    this.steps[stepToPlay].playSound(time, this.hat.amp, singlePlay);
                }
                if(this.steps[stepToPlay].getTom().volume > 0){
                    this.steps[stepToPlay].playSound(time, this.tom.amp, singlePlay);
                }
            }

            
        }
    }
}

class Step{
    constructor(type){
        this.toPlay = 0;
        this.type = type;
        if(type == 'melody'){
            this.osc_param = {...osc_param};
            // this.filter_param = {...filter_param};
            this.LFO = {...LFO};
            this.adsr_mix = {...adsr_mix};
            // this.adsr_filter = {...adsr_filter};
            this.flanger_param = flanger_param;
            this.fold_param = fold_param;
            this.params = ["osc_param", this.osc_param, "LFO", this.LFO, "adsr_mix", this.adsr_mix, "flanger_param", this.flanger_param, "fold_param", this.fold_param];
        }
        else{
            this.kick_param = {...kick_param};
            this.snare_param = {...snare_param};
            this.hat_param = {...hat_param};
            this.tom_param = {...tom_param};
            this.params = ["kick_param", this.kick_param, "snare_param", this.snare_param, "hat_param", this.hat_param, "tom_param", this.tom_param];
        }
        
        
    }

    playSound(time=0, ampEnv, singlePlay=false){
        if(this.toPlay == 1 || singlePlay){
            if(!singlePlay){
                // to stop the previous envelope we trigger the release
                ampEnv.triggerAttackRelease(ampEnv.attack, time + 0.1);
            }else{
                // I had to add the start and stop of the transport because otherwise the synth would not play
                // whenn I started the page. I don't know why this happens, but it works.
                ampEnv.triggerAttackRelease(ampEnv.attack);
            }
            
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
    getKick(){
        return this.kick_param;
    }
    getSnare(){
        return this.snare_param;
    }
    getHat(){
        return this.hat_param;
    }
    getTom(){
        return this.tom_param;
    }
    getFlanger(){
        return this.flanger_param;
    }
    getFolder(){
        return this.fold_param;
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
    setKick(value){
        this.kick_param = value;
    }
    setSnare(value){
        this.snare_param = value;
    }
    setHat(value){
        this.hat_param = value;
    }
    setTom(value){
        this.tom_param = value;
    }

    // setAdsrFilter(value){
    //     this.adsr_filter = value;
    // }
    setFlanger(value){
        this.flanger_param = value;
    }
    setFolder(value){
        this.fold_param = value;
    }
    setParams(value){
        if(this.type == 'melody'){
            this.setOscParam({...value[1]})
            this.setLFO({...value[3]})
            this.setAdsrMix({...value[5]})
            this.setFlanger(value[7])
            this.setFolder(value[9])
            this.params = ["osc_param", this.osc_param, "LFO", this.LFO, "adsr_mix", this.adsr_mix, "flanger_param", this.flanger_param, "fold_param", this.fold_param];
        }else{
            this.setKick({...value[1]})
            this.setSnare({...value[3]})
            this.setHat({...value[5]})
            this.setTom({...value[7]})
            this.params = ["kick_param", this.kick_param, "snare_param", this.snare_param, "hat_param", this.hat_param, "tom_param", this.tom_param];
        }
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
        var LFOModFm = new Tone.Gain(osc_param.LFOamt, "gain");
        var volume = new Tone.Gain(osc_param.volume, "gain");
        var pan = new Tone.Panner(0);
        fmOsc.set({
            frequency: osc_param.freq,
            type: osc_param.type,
            modulationType: osc_param.modType,
            harmonicity: osc_param.harm,
            modulationIndex: osc_param.mod,
        })
        return {
            fmOsc: fmOsc,
            LFOModFm: LFOModFm,
            volume: volume,
            pan: pan,
        };
    }
    
    static createKick(kick_param) {
        var o = new Tone.Oscillator(kick_param.pitch, "triangle"); 
        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: kick_param.a/1000,
            decay: kick_param.d/1000,
            sustain: kick_param.s/1000,
            release: kick_param.r/1000,
        })
        var freqEnv = new Tone.Envelope();
        freqEnv.set({
            attack: kick_param.fa,
            decay: kick_param.fd,
            sustain: kick_param.fs,
            release: kick_param.fr/1000,
        })
        var volume = new Tone.Gain(kick_param.volume, "gain");
        var pan = new Tone.Panner(kick_param.position);
        var freqEnvAmt = new Tone.Gain(kick_param.sweep, "gain");
        o.chain(amp, volume, pan);
        freqEnv.chain(freqEnvAmt, o.frequency);
        o.start();

        return {
            o: o,
            volume: volume,
            pan: pan,
            amp: amp,
            freqEnv: freqEnv,
            freqEnvAmt: freqEnvAmt,
        };
    }
    
    static createLFO(LFO) {
        var LFO = new Tone.Oscillator({
            frequency: LFO.rate,
            waveform: LFO.waveform,
        });
        return LFO;
    }

    static createSnare(snare_param) {
        var tonal = new Tone.Oscillator(snare_param.pitch, "sine");  // Body
        var noise = new Tone.Noise(colorNoise(snare_param.color));     // Snap
        var balance = new Tone.CrossFade(snare_param.balance);
        var volume = new Tone.Gain(snare_param.volume, "gain");
        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: snare_param.a,
            decay: snare_param.d,
            sustain: snare_param.s,
            release: snare_param.r/1000,
        })
        var freqEnv = new Tone.Envelope();
        freqEnv.set({
            attack: snare_param.fa,
            decay: snare_param.fd,
            sustain: snare_param.fs,
            release: snare_param.fr/1000,
        })
        var freqEnvAmt = new Tone.Gain(snare_param.sweep, "gain");
        var pan = new Tone.Panner(snare_param.position);
        tonal.connect(balance.a);
        noise.connect(balance.b);
        balance.chain(amp, volume, pan);
        freqEnv.chain(freqEnvAmt, tonal.frequency);
        tonal.start();
        noise.start();
        return {
            pan: pan,
            amp: amp,
            freqEnv: freqEnv,
            tonal: tonal,
            noise: noise,
            balance: balance,
            volume: volume,
            freqEnvAmt: freqEnvAmt,
        }
    }

    static createHat(){
        var noise = new Tone.Noise("white");
        var filter = new Tone.Filter(hat_param.cutoff, "highpass");   // Si sceglie il carattere degli hat
        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: hat_param.a,
            decay: hat_param.d,
            sustain: hat_param.s,
            release: hat_param.r/1000,
        })
        var volume = new Tone.Gain(hat_param.volume, "gain");
        var pan = new Tone.Panner(hat_param.position);
        noise.chain(filter, amp, volume, pan);
        noise.start();
        return{
            noise: noise,
            filter: filter,
            amp: amp,
            volume: volume,
            pan: pan,
        }
    }

    static createTom(tom_param) {
        var sine = new Tone.Oscillator(tom_param.hiPitch, "sine");
        
        var dist = new Tone.WaveShaper(function (val) {
        var amt = 7;
        return Math.tanh(amt*val);   // Mi piace molto come suona questo soft clipping
        }, 2048);

        var amp = new Tone.AmplitudeEnvelope();
        amp.set({
            attack: tom_param.a,
            decay: tom_param.d,
            sustain: tom_param.s,
            release: tom_param.r/1000,
        })
        var volume = new Tone.Gain(tom_param.volume, "gain");
        var pan = new Tone.Panner(tom_param.position);
        var color = new Tone.CrossFade(tom_param.color);
        sine.chain(amp, dist, color.b);
        amp.connect(color.a);
        color.chain(volume, pan);
        sine.start();
        return{
            sine: sine,
            color: color,
            dist: dist,
            amp: amp,
            volume: volume,
            pan: pan,
        }
    }

    static createFlanger(flanger_param) {

        var LFOl = new Tone.Oscillator(flanger_param.freq, flanger_param.type);
        var LFOr = new Tone.Oscillator(flanger_param.freq + flanger_param.stereo, flanger_param.type);  // Il parametro stereo alza la frequenza di uno dei due LFO
        var modl = new Tone.Gain(flanger_param.width, "gain");
        var modr = new Tone.Gain(flanger_param.width - flanger_param.stereo*0.005, "gain");  // Il parametro stereo abbassa la quantità di modulazione dell'LFO
        var dlyl = new Tone.Delay(0.015, 0.030);
        var dlyr = new Tone.Delay(0.015 - flanger_param.stereo*0.005, 0.035);  // Il parametro stereo abbassa il ritardo iniziale di una delle due linee di ritardo
        var feedbackl = new Tone.Gain(flanger_param.feedback, "gain");
        var feedbackr = new Tone.Gain(flanger_param.feedback, "gain");
        var range_depthl = new Tone.Gain(flanger_param.depth, "gain");
        var range_depthr = new Tone.Gain(flanger_param.depth, "gain");
        var crossFadel = new Tone.CrossFade(0.5);
        var crossFader = new Tone.CrossFade(0.5);
        var dryWet = new Tone.CrossFade(flanger_param.dw);
        var colorl = new Tone.CrossFade(flanger_param.color);  // I due color verranno utilizzati per creare una specie di drywet interno al flanger per gestire la quantità di distorsione
        var colorr = new Tone.CrossFade(flanger_param.color);
        var overdrivel = new Tone.WaveShaper(function (val) {

            var amt = 3 - flanger_param.feedback;  // Bisogna abbassare l'amt di distorsione perché con valori di feedback troppo alti si rischia l'auto-oscillazione del flanger. Il carattere della distorsione dipende tantissimo dal feedback e non solo per l'operazione di sottrazione ma soprattutto per come questo cambia il flusso del segnale audio
            return Math.tanh(2^(amt*val));  //tanh e 2^val sono funzioni utilizzate nel design di distorsori. Io le ho combinate, se volete sperimentate altre funzioni.
            }, 2048);

        var overdriver = new Tone.WaveShaper(function (val) {

            var amt = 3 - flanger_param.feedback;
            return Math.tanh(2^(amt*val));  //tanh e 2^val sono funzioni utilizzate nel design di distorsori. Io le ho combinate, se volete sperimentate altre funzioni.
            }, 2048);    

        var s = new Tone.Split();
        var m = new Tone.Merge();
        s.connect(crossFadel.a, 0, 0);
        crossFadel.connect(dlyl, 0, 0);
        dlyl.connect(overdrivel, 0, 0);
        dlyl.connect(colorl.a, 0, 0);
        overdrivel.connect(colorl.b, 0, 0);
        colorl.connect(feedbackl, 0, 0);
        feedbackl.connect(crossFader.b, 0, 0);  // Qui (e nel punto simmetrico nel canale r) avviene la connessione incrociata dei percorsi di feedback
        dlyl.connect(range_depthl, 0, 0)
        LFOl.chain(modl, dlyl.delayTime);
        s.connect(crossFader.a, 1, 0);
        crossFader.connect(dlyr, 0, 0);
        dlyr.connect(overdriver, 0, 0);
        dlyr.connect(colorr.a, 0, 0);
         overdriver.connect(colorr.b, 0, 0);
        colorr.connect(feedbackr, 0, 0);
        feedbackr.connect(crossFadel.b, 0, 0);
        dlyr.connect(range_depthr, 0, 0)
        LFOr.chain(modr, dlyr.delayTime);
        range_depthl.connect(m, 0, 0);
        range_depthr.connect(m, 0, 1);
        m.connect(dryWet.b);
        LFOl.start();
        LFOr.start();
        return {
            s: s, //Ho voluto fare le connessioni interne del flanger dentro la funzione
            dryWet: dryWet,
            colorl: colorl,
            colorr: colorr,
            overdrivel: overdrivel,
            overdriver: overdriver,
            feedbackl: feedbackl,
            feedbackr: feedbackr,
            range_depthl: range_depthl,
            range_depthr: range_depthr,
            LFOl: LFOl,
            LFOr: LFOr,
            modl: modl,
            modr: modr,
            dlyl: dlyl,
            dlyr: dlyr,
        }
    }

    static folding(amt, val) {
        var condition = val*amt;
        var out1 = 1 - (val * amt - 1);
        var out2 = -1 - (val * amt - 1);
        
        if (condition > 1) {
            if (out1 > -1 && out1 < 1) {
                return out1;
            }else {return Synth.folding(1, out1);}
        } else if (condition < -1) {
            if (out2 < 1 && out2 > -1) {
                return out2;
            } else {return Synth.folding(1, out2);}
                
        } else {
            return val * amt;
        }
    }

    static brutalize(block, fold_amt, dist_amt, drywet) {
        var folder = new Tone.WaveShaper(function (val) {
            return Synth.folding(fold_param.fold_amt, val);
        }, 2048);

        var dist = new Tone.WaveShaper(function (val) {
            
            var amt = fold_param.dist_amt;
        
            return Math.tanh(val*amt);    
            }, 2048);

        var drywetBlock = new Tone.CrossFade(drywet);
        
        block.connect(folder);
        folder.chain(dist, drywetBlock.b);
        folder.connect(drywetBlock.a);
    
        return {
            drywetBlock: drywetBlock,
            dist: dist,
            folder: folder,
        };
    }
    

    
}

class Player{
    constructor(){
        
    }
    start(sequencer){
        if(!seq.isPlaying()){
            sequencer.play();
            Tone.Transport.start();
        }
    }
    stop(sequencer){
        Tone.Transport.stop();
        sequencer.stop();
        changeBorders();
        sequencer.setStepPlaying(0);
        drawSequencer();
    }
    playSound(time){
        var channels = seq.getAllSteps();
        for (var i = 0; i < seq.getNChannels(); i++) {
            channels[i].playChannel(time);
        }
        
    }
}