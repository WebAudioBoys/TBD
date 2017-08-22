
	//Appends the possible midi outputs to all the output elements
	var outputArray = [];

	for(var i = 0; i < WebMidi.outputs.length; i++){
    $('.output').append("<option>"+ WebMidi.outputs[i].name +"</option>");
  	}



  $( '.output' ).change(function() {
    index = $("option:selected", this).index()-1;
    midiOut = WebMidi.outputs[index];
  });












