var socket = io();
var bpmChanged = false;
var tempo = 120;
var index;
var midiOut =  [0,0,0];
var stopCounter = false;
var tempArray;

var noteArray;

noteArray = majorArray.slice();

function setup(){
 
    frameRate(tempo/60);
  }



WebMidi.enable(function (err) {
  if(err){
    console.log("WebMidi is fucked, Dave", err);
  }

  for(var i = 0; i < WebMidi.outputs.length; i++){
    $('.output').append("<option>"+ WebMidi.outputs[i].name +"</option>");
    }
  for(var i = 0; i < synthArray.length; i++){
    $('.output').append("<option>"+synthArray[i].name+"</option>")
  }

    
  $( '.output' ).change(function() {
    index = $("option:selected", this).index()-1;
    console.log("index: " + index);
    module = $(this).parent().index();
    console.log("module: " + module);
    midiOut[module] = WebMidi.outputs[index];
  });
  

});


$(document).ready(function(){
    //Help Dropdown Callback
    $('.switch').on('click',function(event){
      $('#dropdown').toggleClass('hidewindow showwindow');
      console.log("Hey");
    });

    //Tempo Callback
    $('#bpm').change(function(){
      tempo = $(this).val();
      //console.log(tempo);
      bpmChanged = true;
       
      socket.emit('tempo', 
      {
      tempo: tempo,
    })


    });


    $('#playbutton').click(function(event){
      console.log("YOYOY");
      stopCounter = !stopCounter;
    });
  
  //Step Click Callback
  $('.step').click(function(event){
    var row = 0;
    var col = 0;
    var inst = 0;
    var note = 0;
    inst = $(this).closest(".grid").index();
    row = parseInt(($(this).parent().index()-1)) + parseInt((($(this).parent().parent().index()) * 5));
    col = $(this).index();
    note = $(this).parent().index()-1;
    
    socket.emit('step', 
        {
          beat: col,
          note: note,
          inst: inst,
          row: row,
        })

  });

  


  socket.on('stepreturn', function(data){

 
    noteArray[data.row][data.beat] *= -1;
    console.log(noteArray[data.row][data.beat]);
      // minorArray[data.row][data.beat] = minorArray[data.row][data.beat] * -1;
      // majorArray[data.row][data.beat] = majorArray[data.row][data.beat] * -1;
    
    if (noteArray[data.row][data.beat] <   0) {
    $(".grid:eq("+data.inst+") .row:eq("+data.note+") .step:eq("+data.beat+")").css({"background":"white"});
    }else{
    $(".grid:eq("+data.inst+") .row:eq("+data.note+") .step:eq("+data.beat+")").css({"background":"black"});
    }

    // fix this shit
    // $(".row:eq("+(i + rowOffset)+") .step:eq("+j+")").css({"background":"white"});

  });

  socket.on('connection', function(data){
    for(var i = 0; i < 15; i++){
      for(var j = 0; j < 16; j++){
        noteArray[i][j] = noteArray[i][j] * data.noteUpdate[i][j]; 
        if(noteArray[i][j] > 0){
          var rowOffset = 0;
          if (i >= 5 && i < 10 ) {
            rowOffset = 1;
          } else if (i >= 10) {
            rowOffset = 2;
          }
          $(".row:eq("+(i + rowOffset)+") .step:eq("+j+")").css({"background":"black"});
        }         
      }
    }
  });

  socket.on('tempo', function(data){
    tempo = data.tempo;   
    bpmChanged = true;
  });

  $('.key').change(function() {
    keyIndex = $(".key option:selected").index();
    socket.emit('key', 
    {
      newKey: keyIndex - 1,
    });
  });


socket.on('scale', function(data) {
  $(".scale").val(data.newScale);
  
  if (data.newScale == 1) {
    noteArray = majorArray;

  } else if (data.newScale == 2) {
    noteArray = minorArray;
  }
  });
  socket.on('key', function(data) {
    $(".key").val(data.newKey);
    
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 16; j++) {
        noteArray[i][j] = noteArray[i][j] + data.newKey;
      }
    }
  });
});
 



function draw(){


  if(bpmChanged){
    frameRate(tempo/60);
    bpmChanged = false;
    $('#bpm').val(tempo);
    }

    
    tempArray = [[],[],[]];
    if (stopCounter){
      counter = -1;
    }else{
      counter = frameCount%16;
      for(j = 0; j < 3; j++){
        for(i = 0; i < 5;i++){
          if(noteArray[i+ (j*5)][counter] > 0){
            tempArray[j].push(noteArray[i+ (j*5)][counter]);
          }  
        }
      }
    }


    if (counter != 0) {
      $(beat[counter-1]).css("background", "black");
      $(beat[counter]).css("background", "red");

    } else if(counter == 0) {
      $(beat[15]).css("background", "black");
      $(beat[counter]).css("background", "red");
    }
    else{
      $(beat).css("background", "black");
      $(beat[0]).css("background", "red");
    }


    if(midiOut[0]){
      midiOut[0].playNote(tempArray[0], 1);
      midiOut[0].stopNote(tempArray[0], 1, {time: "+500"});
      
    }
    if(midiOut[1]){
      midiOut[1].playNote(tempArray[1], 1);
      midiOut[1].stopNote(tempArray[1], 1, {time: "+500"}); 
    }

    if(midiOut[2]){
      midiOut[2].playNote(tempArray[2], 1);
      midiOut[2].stopNote(tempArray[2], 1, {time: "+500"}); 
    }
  } 




  
  
  
