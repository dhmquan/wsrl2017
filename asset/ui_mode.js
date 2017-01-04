Game.UIMode = {};

Game.UIMode.gameStart = {
  enter: function() {
    console.log("entered gameStart");
  },

  exit: function() {
    console.log("exited gameStart");
  },

  render: function (display) {
    console.log("render gameStart");
    display.drawText(5,5,"game start mode");
    display.drawText(5,6,"press any key to play");
  },

  handleInput: function(inputType, inputData) {
      console.log("gameStart inputType:");
      console.dir(inputType);
      console.log("gameStart inputData:");
      console.dir(inputData);
      if(inputData.charCode != 0 ) { //ignore modding keys
        Game.switchUIMode(Game.UIMode.gamePlay);
      }
  }
};

Game.UIMode.gamePlay = {
  enter: function() {
    console.log("game playing");
  },

  exit: function() {
    console.log("exited gamePlay");
  },

  render: function (display) {
    console.log("render gamePlay");
    display.drawText(5,5,"game play mode");
    display.drawText(5,6,"W to win, L to lose, any other key to keep playing");
  },

  handleInput: function(inputType, inputData) {
      console.log("gamePlay inputType:");
      console.dir(inputType);
      console.log("gamePlay inputData:");
      console.dir(inputData);
      if (inputType == 'keypress') { //ignore modding keys
        if ((inputData.key == 'W') || ((inputData.key == 'w') && (inputData.shiftKey))) {
          Game.switchUIMode(Game.UIMode.gameWin);
        } else if ((inputData.key == 'L') || ((inputData.key == 'l') && (inputData.shiftKey))) {
          Game.switchUIMode(Game.UIMode.gameLose);
        }
      }
  }
};

Game.UIMode.gameWin = {
  enter: function() {
    console.log("game winning");
  },

  exit: function() {
    console.log("exited gameWin");
  },

  render: function (display) {
    console.log("render gameWin");
    display.drawText(5,5,"game won!");
  },

  handleInput: function(inputType, inputData) {
      console.log("gameStart inputType:");
      console.dir(inputType);
      console.log("gameStart inputData:");
      console.dir(inputData);
  }
};

Game.UIMode.gameLose = {
  enter: function() {
    console.log("game losing");
  },

  exit: function() {
    console.log("exited gameLose");
  },

  render: function (display) {
    console.log("render gamePlay");
    display.drawText(5,5,"game lost :(");
  },

  handleInput: function(inputType, inputData) {
      console.log("gameStart inputType:");
      console.dir(inputType);
      console.log("gameStart inputData:");
      console.dir(inputData);
      }
};
