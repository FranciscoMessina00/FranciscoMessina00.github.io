// Tone.start();

var seq = new Sequencer();
var player = new Player();
var canvas = document.getElementById("step");
var ctx = canvas.getContext("2d");
const scale = 0.3;
canvas.width  = 1200;
canvas.height = 80;
const space = ((canvas.width - (200 * 16 * scale)) / 16) / scale;
const heightShift = canvas.height - canvas.height/2;
var prevSelected = 0;
var dodecagon = [
    {x: 0*scale   , y: -100*scale},
    {x: -50*scale , y: -87*scale },
    {x: -87*scale , y: -50*scale },
    {x: -100*scale, y: 0*scale   },
    {x: -87*scale , y: 50*scale  },
    {x: -50*scale , y: 87*scale  },
    {x: 0*scale   , y: 100*scale },
    {x: 50*scale  , y: 87*scale  },
    {x: 87*scale  , y: 50*scale  },
    {x: 100*scale , y: 0*scale   },
    {x: 87*scale  , y: -50*scale },
    {x: 50*scale  , y: -87*scale },
]

var clearArea = {
    x: 0,
    y: 0,
    width: (canvas.width / 16),
    height: canvas.height
}
var colorDodOffOut = '#D9D9D9';
var colorDodOffIn = '#B1B1B1';

var colorDodOnOut = '#8951FF';
var colorDodOnIn = '#BE6AFF';

var colorPlayingOut = '#F5A94F'
var colorPlayingIn = '#C89140';

var colorRectOffNotSel = '#7B7B7B';
var colorRectOffSel = '#D9D9D9';
var colorRectOn = '#C80000';

var strokeSelected = '#5c1001';
var strokeNotPlaying = '#343434';
var strokePlaying = '#6C3D11';