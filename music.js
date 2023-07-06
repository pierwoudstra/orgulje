let loudness = -10;
let detuner;

let midinote;

let xloc = 200;
let yloc = 200;

let octave = 3;
let scale = 0;

const keyboard = new AudioKeys();

const synth = new Tone.MonoSynth({
	oscillator: {
		type: "sawtooth"
	},
	portamento: 0.1,
	detune: 3,
	volume: loudness,
	envelope: {
		attack: 0.1,
	}
}).toDestination();

const droneSynth = new Tone.MonoSynth({
	oscillator: {
		type: "sine"
	},
	//portamento: 0.1,
	detune: -3,
	volume: loudness-12,
	envelope: {
		attack: 0.8,
	}
}).toDestination();

const pitchEffect = new Tone.PitchShift({
	pitch : 12,
	feedback: 0.4,
	delayTime : 0
}).toDestination();

synth.connect(pitchEffect);
droneSynth.connect(pitchEffect);

let img = [];

let amt;
let amt2;

function setup() {
	img[0] = loadImage('assets/slika6.webp');
	img[1] = loadImage('assets/slika7.webp');
	img[2] = loadImage('assets/slika8.webp');
	img[3] = loadImage('assets/slika9.webp');
	img[4] = loadImage('assets/slika10.webp');
	createCanvas(400, 400);
	frameRate(5);
}

// tekenen van de bal op scherm
function draw() {
	background(0, 0, 255,100);
		
	let im = random(img);

	if (keyIsPressed) {
		tint(255, 150);
		image(im,0,0,400,400);
	}

	let s = 'play the synth with ASDFGHJKL keys';
	let d = 'change the octave with X & Z keys';
	let f = 'move your mouse 4 extra effects';
	fill(255);
	text(s, 10, 10, 70, 80); // Text wraps within text box
	text(d, 330, 348, 70, 80); // Text wraps within text box
	text(f, 10, 348, 70, 80); // Text wraps within text box

	amt = abs(map(mouseX,0,1000,0.1,1));
	amt2 = abs(map(mouseY,0,1000,0.1,1));


	// ellipse(xloc,yloc, 40, 40);
	// fill(180);
	// noStroke();
}

// noot aan
keyboard.down((key) => {
	//console.log(key);

	console.log(amt);

	octave = Math.floor(key.note / 12)-1;

	midinote = arvoPart(key.note, octave, scale);
	console.log(midinote, detuner);
	freqNote = noteToFreq(midinote);

	synth.filter.frequency = yloc;
	console.log(synth.portamento);

	synth.triggerAttackRelease(key.frequency);
	droneSynth.triggerAttackRelease(freqNote);

	pitchEffect.pitch = amt*amt;
	pitchEffect.delayTime = amt*amt;
});

// noot uit
keyboard.up((key) => {

	synth.triggerAttackRelease(key.frequency, 0);
	droneSynth.triggerAttackRelease(freqNote, 0.3);
})


// functies om dingen te berekenen
function noteToFreq(note) {
    let a = 440; //frequency of A (coomon value is 440Hz)
    return (a / 32) * (2 ** ((note - 9) / 12));
}

function arvoPart(mid, oct, scale) {
	let input = mid % 12;
	if (input === 0 || input === 11) {
		return (oct*12) + 9 + scale;
	} else if (input === 2 || input === 4 || input === 5) {
		return (oct*12 + scale);
	} else if (input === 7 || 9) {
		return (oct*12) + 4 + scale;
	} else {
		return 63;
	}
}