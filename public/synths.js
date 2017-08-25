function soundModule(synthObj, name){
	this.name = name;
	this.synth = synthObj;
}

function midiToFreq(midiValue){
	var frequency = 440 * (Math.pow(2, (midiValue-69)/12));
	return frequency;
}

function playit(synthArray, number, duration, midiNumber){
	synthArray[number].synth.triggerAttackRelease(midiToFreq(midiNumber), .1);
}
synthArray = [];


synthArray.push(new soundModule(new Tone.AMSynth().toMaster(), "AMSynth"));
synthArray.push(new soundModule(new Tone.MonoSynth().toMaster(), "MonoSynth"));
synthArray.push(new soundModule(new Tone.Synth().toMaster(), "SquareSynth"));
synthArray.push(new soundModule(new Tone.DuoSynth().toMaster(), "DuoSynth"));
synthArray.push(new soundModule(new Tone.PolySynth().toMaster(), "PolySynth"));





