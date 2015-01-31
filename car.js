var gpio = require("pi-gpio");
var readline = require("readline");

var AllPins = [];
AllPins['LeftFwd'] = 16;
AllPins['LeftBk'] = 15;
AllPins['RightFwd'] = 12;
AllPins['RightBk'] = 11;

function cleanup(){
  for (var p in AllPins){
   gpio.close(AllPins[p]);
   console.log(p + " is closed");
  }
}

// turn on a single motor for an amount of time
function drive(pinName, howLong){
  setPin(pinName, 1);
  setTimeout(function(){
    setPin(pinName, 0);
  }, howLong);
}

// self cleaning. open, set, close
function setPin(pinName, pinValue){
  gpio.open(AllPins[pinName], "output", function(err){
    gpio.write(AllPins[pinName], pinValue, function(){
      gpio.close(AllPins[pinName]);
    });
  });
}

// direction helpers
function goForward(howLong){
  console.log('going forward for ' + howLong + ' seconds');
  drive('LeftFwd', howLong);
  drive('RightFwd', howLong);
}

function goBackward(howLong){
  drive('LeftBk', howLong);
  drive('RightBk', howlong);
}

function turnRight(howLong){
  drive('RightBk', howLong);
  drive('LeftFwd', howLong);
}

function turnLeft(howLong){
  drive('LeftBk', howLong);
  drive('RightBk', howLong);
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

prompt();
