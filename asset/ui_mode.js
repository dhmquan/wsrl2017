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
    display.drawText(5,5,"game start mode");
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

Game.UIMode.gameWin = {
  enter: function() {
    console.log("game winning");
  },

  exit: function() {
    console.log("exited gameWin");
  },

  render: function (display) {
    console.log("render gameWin");
    display.drawText(5,5,"game start mode");
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

Game.UIMode.gameLose = {
  enter: function() {
    console.log("game losing");
  },

  exit: function() {
    console.log("exited gameLose");
  },

  render: function (display) {
    console.log("render gamePlay");
    display.drawText(5,5,"game start mode");
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
