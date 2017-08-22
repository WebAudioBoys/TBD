var socket = io();
var bpmChanged = false;
var tempo = 120;
var drums, drumIndex;
var bass, bassIndex;
var high, highIndex; 
var midiOut =  [0,0,0];

var noteArray;

noteArray = majorArray;

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
    
  $( '.output' ).change(function() {
    console.log("nutty");
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
  
  //Step Click Callback
  $('.step').click(function(event){
    $(this).css({"background":"black"});
    
    var label="";
    var row = 0;
    var col = 0;
    inst = $(this).closest(".grid").index();
    row = parseInt(($(this).parent().index()-1)) + parseInt((($(this).parent().parent().index()) * 5));
    // console.log("this is the row: " + row);
    // console.log("this is the row property: " + ($(this).parent().index()-1));
    col = $(this).index();

    // update background, play note if activated
    // if (noteArray[row][col] > 0) {
    //   $(this).css({"background":"white"});
    // } else {
    //   $(this).css({"background":"black"});
    // }


    // toggle note array values on/off
    //noteArray[row][col] = noteArray[row][col] * -1;
    
    socket.emit('step', 
        {
          beat: col,
          note: $(this).parent().index()-1,
          inst: inst,
          row: row,
        })

  });

  


  socket.on('step', function(data){

    if (noteArray[data.row][data.beat] > 0) {
    $(".grid:eq("+data.inst+") .row:eq("+data.note+") .step:eq("+data.beat+")").css({"background":"white"});
    }else{
    $(".grid:eq("+data.inst+") .row:eq("+data.note+") .step:eq("+data.beat+")").css({"background":"black"});
    }
    noteArray[data.row][data.beat] = noteArray[data.row][data.beat] * -1;
    minorArray[data.row][data.beat] = minorArray[data.row][data.beat] * -1;
    majorArray[data.row][data.beat] = majorArray[data.row][data.beat] * -1;

  });

  socket.on('connection', function(data){
    console.log("I'm Dave and Darth likes it");
    console.log(data);
    for(var i = 0; i < 15; i++){
      var gridRow = i;
      var instr = Math.floor(i/5);
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
          console.log("refresh shit row: " + i);
        }
        
      }
    }
    console.log(noteArray);
  })

  socket.on('tempo', function(data){
    tempo = data.tempo;
    console.log(tempo);

    bpmChanged = true;
  });

  // watch for scale changes
  // $('.scale').change(function() {
  //   scaleIndex = $(".scale option:selected").index()+1;
  //   // send scale info
  //   socket.emit('scale', 
  //   {
  //     newScale: scaleIndex,
  //   });
  // });
  // watch for key changes
  $('.key').change(function() {
    keyIndex = $(".key option:selected").index();
    // send key info
    socket.emit('key', 
    {
      newKey: keyIndex - 1,
    });
  });

  // receive scale and key from other users
// receive scale and key from other users
socket.on('scale', function(data) {
  $(".scale").val(data.newScale);
  
  if (data.newScale == 1) {
    noteArray = majorArray;
    // for (var i = 0; i < 10; i++) {
    //   for (var j = 0; j < 16; j++) {
    //     if (noteArray[i][j] > 0) {
    //       noteArray[i][j] = noteArray[i][j] + min2maj[i%5];
    //     } else {
    //       noteArray[i][j] = noteArray[i][j] - min2maj[i%5];
    //     }
    //   }
    // }
  } else if (data.newScale == 2) {
    noteArray = minorArray;
    // for (var i = 0; i < 10; i++) {
    //   for (var j = 0; j < 16; j++) {
    //     if (noteArray[i][j] > 0) {
    //       noteArray[i][j] = noteArray[i][j] + maj2in[i%5];
    //     } else {
    //       noteArray[i][j] = noteArray[i][j] - maj2in[i%5];
    //     }
    //   }
    // }
  }
  });
  socket.on('key', function(data) {
    $(".key").val(data.newKey);
    
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 16; j++) {
        noteArray[i][j] = noteArray[i][j] + data.newKey;
      }
    }
    console.log(data.newKey);
  });
});
 
function draw(){
  if(bpmChanged){
    frameRate(tempo/60);
    bpmChanged = false;
    console.log("tempo ", tempo);
    $('#bpm').val(tempo);
    console.log(frameRate());
    }

    counter = frameCount%16;
   
    //tickerTime = "ticker: " + counter;
    //$(".ticker").text(tickerTime);

  ////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  //Code For Iterating the Counter///////////////////////
    // shade cells at pace of counter

    if (counter != 0) {
      $(beat[counter-1]).css("background", "black");
      $(beat[counter]).css("background", "red");
    } else {
      $(beat[15]).css("background", "black");
      $(beat[counter]).css("background", "red");
    }


    var tempArray = [[],[],[]];
    for(j = 0; j < 3; j++){
      for(i = 0; i < 5;i++){
        if(noteArray[i+ (j*5)][counter] > 0){
          tempArray[j].push(noteArray[i+ (j*5)][counter]);
        }  
      }
    }

    //console.log(tempArray);
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




  
  
  
