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
        Game.switchUIMode(Game.UIMode.gamePersistence);
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
    display.drawText(5,7,"= to save, load or start a new game");
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
        } else if (inputData.key == '=') {
          Game.switchUIMode(Game.UIMode.gamePersistence);
        }
      }
  }
};

Game.UIMode.gamePersistence = {
  enter: function() {
    console.log("entered gamePersistence");
  },

  exit: function() {
    console.log("exited gamePersistence");
  },

  render: function (display) {
    console.log("render gamePersistence");
    display.drawText(5,6,"S to save, L to load, N for a new game");
  },

  handleInput: function(inputType, inputData) {
      console.log("input for gamePersistence");
      if (inputType == 'keypress') { //ignore modding keys
        if ((inputData.key == 'S') || ((inputData.key == 's') && (inputData.shiftKey))) {
          if (this.localStorageAvailable()) {
            window.localStorage.setItem(Game._PERSISTENCE_NAMESPACE, JSON.stringify(Game._game)); //.toJSON()
            Game.switchUIMode(Game.UIMode.gamePlay);
          }
        } else if ((inputData.key == 'L') || ((inputData.key == 'l') && (inputData.shiftKey))) {
          var json_state_data = '{"randomSeed":12}';
          var state_data = JSON.parse(json_state_data);
          Game.setRandomSeed(state_data.randomSeed);
          Game.switchUIMode(Game.UIMode.gamePlay);
        } else if ((inputData.key == 'N') || ((inputData.key == 'n') && (inputData.shiftKey))) {
          Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
          Game.switchUIMode(Game.UIMode.gamePlay);
        }
      }
  },

  localStorageAvailable: function() {
    try {
  		var x = '__storage_test__';
  		window.localStorage.setItem(x, x);
  		window.localStorage.removeItem(x);
  		return true;
  	}
  	catch(e) {
      Game.Message.send('Sorry, no local data storage is available for this browser');
  		return false;
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
