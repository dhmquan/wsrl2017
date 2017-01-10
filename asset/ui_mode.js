Game.UIMode = {};

Game.UIMode.DEFAULT_COLOR_FG;
Game.UIMode.DEFAULT_COLOR_BG;

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
  attr: {
    _map: null
  },

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
    this.attr._map.renderOn(display);
  },

  renderAvatar: function (display) {
    Game.Symbol.AVATAR.draw(display,this.attr._avatar.getX()-this.attr._cameraX+display._options.width/2,
                                    this.attr._avatar.getY()-this.attr._cameraY+display._options.height/2);
  },

  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.attr._avatar.getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.attr._avatar.getY(),fg,bg); // DEV
  },
  
  moveAvatar: function (dx,dy) {
    if (this.attr._avatar.tryWalk(this.attr._map,dx,dy)) {
      this.setCameraToAvatar();
    }
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
  },

  setupPlay: function() {
    var generator = new ROT.Map.Cellular(80,24);
    generator.randomize(.5);
    for (var i=0;i<3;i++) {
      generator.create();
    }
    var tileArray = Game.util.init2DArray(80,24,Game.Tile.nullTile);
    generator.create(function(x,y,val) {
      if (val === 1) {
        tileArray[x][y] = Game.Tile.floorTile;
      } else {
        tileArray[x][y] = Game.Tile.wallTile;
      }
    });
    this.attr._map = new Game.Map(tileArray);
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
          Game.UIMode.gamePlay.setupPlay();
          Game.switchUIMode(Game.UIMode.gamePlay);
        } else if ((inputData.key == 'N') || ((inputData.key == 'n') && (inputData.shiftKey))) {
          Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
          Game.UIMode.gamePlay.setupPlay();
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
