var gpio = require("pi-gpio");
var readline = require("readline");

var AllPins = [];
AllPins['LeftFwd'] = 16;
AllPins['LeftBk'] = 15;
AllPins['RightFwd'] = 12;
AllPins['RightBk'] = 11;

function openAll(){
  for (var p in AllPins){
     gpio.open(AllPins[p], "output", function(err) {
    });
  }
}

function exit(){
  if(cleanup()){
    process.exit();
  }
}

function reset(){  
  if(cleanup()){
    openAll();
  }
}
function cleanup(){
  for (var p in AllPins){
   gpio.close(AllPins[p]);
   console.log(p + " is closed");
  }
  return true;
}

// turn on a single motor for an amount of time
function drive(pinName, howLong){
  if(setPin(pinName, 1)){
    setTimeout(function(){
      if(setPin(pinName, 0)){
        console.log ('turned off');
      }
    }, howLong, pinName);
  }
}

function setPin(pinName, pinValue){
  gpio.write(AllPins[pinName], pinValue);
  return true;
}

// direction helpers
function goForward(howLong){
  drive('LeftFwd', howLong);
  drive('RightFwd', howLong);
}

function goBackward(howLong){
  drive('LeftBk', howLong);
  drive('RightBk', howLong);
}

function turnLeft(howLong){
  drive('RightBk', howLong);
  drive('LeftFwd', howLong);
}

function turnRight(howLong){
  drive('LeftBk', howLong);
  drive('RightFwd', howLong);
}

// readline interface
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(){
  rl.question("What should we do?", function(answer){
     var args = answer.split(" ");
     console.log(args);
     eval(args[0] + '(' + args[1] + ')');
     rl.close;
     prompt();
  });
}

reset();
prompt();

