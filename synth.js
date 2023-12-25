const c = new AudioContext();
c.resume();
Tone.context = c;

var osc_param = {
    freq : 440,         //20-20000 Hz
    type : "sine", 
    modtype: "sine", 
    harm : 1.3,          //0-30 raporto di freq tra i due oscillatori
    mod : 3,             //0-100 quantità di modulazione (non so se è solo un nodo di gain)
    LFOamt: 10,          //0-25 quantità di mod dell LFO (guarda LFO_amount nei par del filtro per la spiegazione)
}
var global = {
    glide : 0,
    vibrato : 0,
    position: 0,        //-1, 1 posizione left-right
    LFOpos: 0,          //0-1 LFO sposta la posizione
}

var filter_param = {
    cutoff: 1000,       //20-20000 Hz
    resonance : 5,      //0-10, causa un picco nel suono
    // keyboard_tracking : 0,
    type : 'lowpass',
    env_amount : 0,     //0-20000, caso limie: parto da 0 Hz e l'inviluppo mi fa arrivare a 20 kHz
    LFO_amount : 100,     //0-10000, per avere tutto il range di freq: cutoff a 10 kHz e LFO che va da -10000 a +10000
}

var LFO = {             // tutti gli LFO implementati in questo synth sono bipolari (-1,1) e arrivano in banda audio. Ogni volta che si usa un nodo di gain per controllare la modulazione se si utilizzano valori negativi si inverte la forma d'onda (utile per passare da dente a rampa)
    waveform : 'square',
    rate : 1, //0.1-20000 Hz
    sync : false,
}

var adsr_mix = {
    is_ar : false,
    attack : 0.5,       //0-3 s
    decay : 0.5,        //0-3 s
    sustain: 0.5,       //0-1
    release : 2         //0-3 s
}

var adsr_filter = {
    is_ar : false,
    attack : 1,         //0-3 s
    decay : 0.6,        //0-3 s
    sustain: 0.5,       //0-1
    release : 1         //0-3 s
}

var flanger_param = {   // Notare che spostare l'overdive prima o dopo il nodo di feedback cambia il timbro. Anche cambiare la funzione del waveshaper ha un effetto pesante. Bisogna scegliere.
    rate : 0.3,           //0.1-20000 Hz
    type : 'sine',
    depth: 0.3,         //0.1-1    Attenua l'uscita delle delay line
    feedback : 0.9,     //0-1      Regola il feedback (1 è abbastanza sgravato). Notare l'implementazione di un percorso di crossfeedback (il feedback di destra va al canale sinistro e viceversa, vedi createFlanger)
    width : 0.010,      //0-0.015  Osserva i valori delle delay line!
    dw: 0.5,              //0-1      Semplice DryWet
    color: 0.3,         //0-1      Quantità di distorsione. Questo comportamento è fortemente influenzato dal valore di feedback (vedi createFlanger per vedere come i due parametri sono relazionati)
    stereo: 1           //0-1      Crea delle differenze tra il canale di destra e sinistra (vedi createFlanger)   
}



function createAmpEnv(a, d, s, r) { 
    var ampEnv = new Tone.AmplitudeEnvelope();
    ampEnv.set({
    attack: a,
    decay: d,
    sustain: s,
    release: r,
    })               
    return ampEnv;     
}

function createOscillator(osc_param) {
    var fmOsc = new Tone.FMOscillator();
    var LFOModFm = new Tone.Gain(osc_param.LFOamt);
    fmOsc.set({
        frequency: osc_param.freq,
        type: osc_param.type,
        modulationType: osc_param.modtype,
        harmonicity: osc_param.harm,
        modulationIndex: osc_param.mod,
    })
    return {
        fmOsc: fmOsc,
        LFOModFm: LFOModFm};
}

function createFilter(filter_param, adsr_filter){
    var filter = new Tone.Filter()
    filter.set({
        frequency : filter_param.cutoff,
        Q : filter_param.resonance,
        type : filter_param.type,
    })
    var env = createFilterEnv(adsr_filter.attack,adsr_filter.decay,adsr_filter.sustain,adsr_filter.release);
    var envAmount = new Tone.Gain(filter_param.env_amount);
    var LFOAmt = new Tone.Gain(filter_param.LFO_amount);
    
    return {
        filter: filter,
        env: env, 
        envAmount: envAmount, 
        LFOAmt: LFOAmt};
}



function createFilterEnv(a, d, s, r) {
    return FilterEnv = new Tone.Envelope({
    attack: a,
    decay: d,
    sustain: s,
    release: r,
    });

}

function createLFO(LFO) {
    return LFO = new Tone.Oscillator({
        frequency: LFO.rate,
        waveform: LFO.waveform,
    });
}

function createFlanger(flanger_param) {

    var LFOl = new Tone.Oscillator(flanger_param.rate, flanger_param.type);
    var LFOr = new Tone.Oscillator(flanger_param.rate + flanger_param.stereo, flanger_param.type);  // Il parametro stereo alza la frequenza di uno dei due LFO
    var modl = new Tone.Gain(flanger_param.width);
    var modr = new Tone.Gain(flanger_param.width - flanger_param.stereo*0.005);  // Il parametro stereo abbassa la quantità di modulazione dell'LFO
    var dlyl = new Tone.Delay(0.015, 0.030);
    var dlyr = new Tone.Delay(0.015 - flanger_param.stereo*0.005, 0.035);  // Il parametro stereo abbassa il ritardo iniziale di una delle due linee di ritardo
    var feedbackl = new Tone.Gain(flanger_param.feedback);
    var feedbackr = new Tone.Gain(flanger_param.feedback);
    var range_depthl = new Tone.Gain(flanger_param.depth);
    var range_depthr = new Tone.Gain(flanger_param.depth);
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
        s: s, //Ho voluto fare le connessioni interne del flanger dentro la funzione, ho messo a disposizione solo il nodo in e out
        dryWet: dryWet,
    }
}


var filter = createFilter(filter_param, adsr_filter);
var ampEnv = createAmpEnv(adsr_mix.attack,adsr_mix.decay,adsr_mix.sustain,adsr_mix.release);
var oscillator = createOscillator(osc_param);
var flanger = createFlanger(flanger_param);
var LFO = createLFO(LFO);
var pan = new Tone.Panner(global.position);
var LFOpan = new Tone.Gain(global.LFOpos);
var limiter = new Tone.Limiter(0);  // Secondo voi va bene questa scelta?

oscillator.fmOsc.chain(ampEnv, filter.filter, pan, flanger.s);
pan.connect(flanger.dryWet.a)
flanger.dryWet.chain(limiter, Tone.Destination);
filter.env.chain(filter.envAmount, filter.filter.frequency);
LFO.chain(filter.LFOAmt, filter.filter.frequency);
LFO.chain(oscillator.LFOModFm, oscillator.fmOsc.modulationIndex);
LFO.chain(LFOpan, pan.pan);

LFO.start();
oscillator.fmOsc.start();

    


