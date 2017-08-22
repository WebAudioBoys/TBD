var socket = io();
var bpmChanged = false;
var tempo = 120;
var drums,drumIndex;
var bass,bassIndex;
var high, highIndex;  

var noteArray;
majorArray = [
  [-61, -61, -61, -61, -61, -61, -61, -61, -61, -61, -61, -61, -61, -61, -61, -61],
  [-59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59],
  [-56, -56, -56, -56, -56, -56, -56, -56, -56, -56, -56, -56, -56, -56, -56, -56],
  [-54, -54, -54, -54, -54, -54, -54, -54, -54, -54, -54, -54, -54, -54, -54, -54],
  [-52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52],

  [-49, -49, -49, -49, -49, -49, -49, -49, -49, -49, -49, -49, -49, -49, -49, -49],
  [-47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47],
  [-44, -44, -44, -44, -44, -44, -44, -44, -44, -44, -44, -44, -44, -44, -44, -44],
  [-42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42],
  [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
    
  [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
  [-46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46],
  [-42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42],
  [-38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38],
  [-36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36],]

  /*minorArray = [
  [-62, -62, -62, -62, -62, -62, -62, -62, -62, -62, -62, -62, -62, -62, -62, -62],
  [-59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59, -59],
  [-57, -57, -57, -57, -57, -57, -57, -57, -57, -57, -57, -57, -57, -57, -57, -57],
  [-55, -55, -55, -55, -55, -55, -55, -55, -55, -55, -55, -55, -55, -55, -55, -55],
  [-52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52, -52],

  [-50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50, -50],
  [-47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47, -47],
  [-45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45, -45],
  [-43, -43, -43, -43, -43, -43, -43, -43, -43, -43, -43, -43, -43, -43, -43, -43],
  [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
    
  [-40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40, -40],
  [-46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46, -46],
  [-42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42, -42],
  [-38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38, -38],
  [-36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36, -36],]
*/

noteArray = majorArray;

function setup(){
 
    frameRate(tempo/60);
  }



WebMidi.enable(function (err) {
  if(err){
    console.log("WebMidi is fucked, Dave", err);
  }
////////////////////////////////////////////////////////////////////////////////
//Drum//////Dropdown///////////////////////////////////////////////////////////

for(var i = 0; i < WebMidi.outputs.length; i++){
$('.drumoutput').append("<option>"+ WebMidi.outputs[i].name +"</option>");
}

$( '.drumoutput' ).change(function() {
  drumIndex = $(".drumoutput option:selected").index();
  drumIndex = drumIndex-1;
  drums = WebMidi.outputs[drumIndex];
  console.log(drums);
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//Bass////////Output////////////////////////////////////////////////////////////
for(i = 0; i < WebMidi.outputs.length; i++){
$('.bassoutput').append("<option>"+ WebMidi.outputs[i].name +"</option>");
}

$( '.bassoutput' ).change(function() {
  bassIndex = $(".bassoutput option:selected").index();
  bassIndex = bassIndex-1;
  bass = WebMidi.outputs[bassIndex];
  console.log(bass);
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//High////////Output////////////////////////////////////////////////////////////
for(var i = 0; i < WebMidi.outputs.length; i++){
$('.highoutput').append("<option>"+ WebMidi.outputs[i].name +"</option>");
}

$( '.highoutput' ).change(function() {
  highIndex = $(".highoutput option:selected").index();
  highIndex = highIndex-1;
  high = WebMidi.outputs[highIndex];
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////  
  //Print outputs to the console

  // for(var i = 0; i < WebMidi.outputs.length; i++){
  
  //   console.log(WebMidi.outputs[i].name);
  // }


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
   var beat = ['.beatbar:nth-child(1)',
                '.beatbar:nth-child(2)',
                '.beatbar:nth-child(3)',
                '.beatbar:nth-child(4)',
                '.beatbar:nth-child(5)',
                '.beatbar:nth-child(6)',
                '.beatbar:nth-child(7)',
                '.beatbar:nth-child(8)',
                '.beatbar:nth-child(9)',
                '.beatbar:nth-child(10)',
                '.beatbar:nth-child(11)',
                '.beatbar:nth-child(12)',
                '.beatbar:nth-child(13)',
                '.beatbar:nth-child(14)',
                '.beatbar:nth-child(15)',
                '.beatbar:nth-child(16)',];
    if (counter != 0) {
      $(beat[counter-1]).css("background", "black");
      $(beat[counter]).css("background", "red");
    } else {
      $(beat[15]).css("background", "black");
      $(beat[counter]).css("background", "red");
    }

    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var tempArray = [[],[],[]];
    for(j = 0; j < 3; j++){
      for(i = 0; i < 5;i++){
      if(noteArray[i+ (j*5)][counter] > 0){
        tempArray[j].push(noteArray[i+ (j*5)][counter]);
      }  
    }
    }
    //console.log(tempArray);
     if(high){
      high.playNote(tempArray[0], 1);
      high.stopNote(tempArray[0], 1, {time: "+500"});
    }

    if(bass){
      bass.playNote(tempArray[1], 1);
      bass.stopNote(tempArray[1], 1, {time: "+500"});
    }

    if(drums){
      drums.playNote(tempArray[2], 1);
      drums.stopNote(tempArray[2], 1, {time: "+500"});
    }


  } 




  
  
  
