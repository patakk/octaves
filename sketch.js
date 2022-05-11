let canvas;
var pg;
let osc;
let osc2;
let envelopes = [];

var N = 5;

let helvetica;
let blurShader;

var shouldReset = true;

var firstClick = false;

function preload() {
    helvetica = loadFont('assets/HelveticaNeueBd.ttf');
    blurShader = loadShader('assets/blur.vert', 'assets/blur.frag');
}

var notes;
notes = [0, 2., 2., 1., 2., 2., 2., 1.];
notes = [0, 2., 1., 2., 2., 1., 3., 1.];
notes = [0, 2., 3., 2., 2., 3.];

for(var k = 1; k < notes.length; k++){
    notes[k] = notes[k-1] + notes[k];
}

function setup(){
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  pg = createGraphics(width, height);
  imageMode(CENTER);

  osc = new p5.SinOsc();
  osc2 = new p5.SinOsc();

  for(k = 0; k < N; k++){
    var envelope = new p5.Env();
    // set attackTime, decayTime, sustainRatio, releaseTime
    // set attackLevel, releaseLevel
    if(k == 0){
      envelope.setRange(.9, 0.0);
      envelope.setADSR(0.02, 1.6, 0.6, 2.4);
      
    }
    else{
      
      envelope.setADSR(0.02, 0.6, 0.2, 0.4);
    envelope.setRange(.3, 0.0);
    }
      //envelope.setADSR(0.02, 0.3, 0.1, 0.1);
    envelopes.push(envelope);
  }
  
  pg.colorMode(HSB, 100)
  
  osc.freq(150);
  osc.amp(0);
  osc.start();
  osc2.freq(150);
  osc2.start();
  osc2.amp(0);
}

alphab = "!\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
alphab = "0123456789";

var parts = [];

var pstr = "hello";
var ppstr = "hello";

function draw() {
  //image(pg, -width/2, -height/2);
  if (frameCount % 60 === 0 || frameCount === 1) {
    //envelope.play(osc, 0, 0.1);
  }
  if (frameCount % 60 === 8 || frameCount === 1000000) {
    //envelope2.play(osc, 0, 0.1);
  }
  
  pg.background(90);
  pg.noStroke();
  pg.textFont(helvetica);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(80);
  
  if(parts.length < 2){
    parts.push([0, 0])
  }
  var toremove = [];
  for(var p = 0; p < parts.length; p++){
    parts[p][1] += parts[p][1]/(height/8)+3.;
    if(parts[p][1] > height/4)
       toremove.push(p);
  }
  for(var tt = 0; tt < toremove.length; tt++){
    parts.splice(toremove[tt], 1);
  }
  
  for(var p = 0; p < parts.length*0+1; p++){

    ppstr = pstr;
    pstr = "";
    for(var k = 0; k < N; k++){
      var idx = floor(random(alphab.length));
      idx = round(100*noise(frameCount*0.0006,k,p))%notes.length;
      //idx = floor(frameCount/50.)%notes.length;
      //idx = p;
      pstr = pstr + "" + idx;
      if(pstr.charAt(k) != ppstr.charAt(k) && frameCount > 1){
        var ffrq;
        var note = notes[idx];
        ffrq = 200+300*idx/10.;
        ffrq = 60 * pow(1.059463094359, note);
        if(k==0){
          osc.freq(140 * pow(1.059463094359, note-12.));
          envelopes[k].play(osc, 0, 0.1)
        }
        else{
          osc2.freq(140 * pow(1.059463094359, note));
          envelopes[k].play(osc2, 0, 0.1)
        }
      }
    }
    for(var y = 20; y > 0; y -= 3){
      pg.fill(40, 80*y/30., 90-30*y/30.);
      //pg.text(pstr, width/2+y*.4, height/2+y);
    }
    pg.fill(10);
    pg.text(pstr, width/2, height/2);
  }
  pg.stroke(0);
  pg.strokeWeight(10);
  pg.strokeCap(PROJECT);
  pg.line(width/2-104, height/2+60, width/2+104, height/2+60);
  
  ///////

  blurShader.setUniform('tex0', pg);
  blurShader.setUniform('texelSize', [1 / width, 1 / height]);
  blurShader.setUniform('grunge', random(1.6));
  blurShader.setUniform('grunge2', random(0.3, 0.6));
  blurShader.setUniform('frq1', random(0.003, 0.008));
  blurShader.setUniform('frq2', random(0, 1));
  blurShader.setUniform('frq3', random(0, 1));
  blurShader.setUniform('frq4', random(0, 1));
  blurShader.setUniform('frq5', random(0, 1));
  blurShader.setUniform('frq6', random(0, 1));
  blurShader.setUniform('zamp', 1.);

  shader(blurShader);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
  
  //image(pg, 0, 0);
}



function shaderOnCanvas(tex){
}