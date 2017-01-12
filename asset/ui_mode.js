Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = '#fff';
Game.UIMode.DEFAULT_COLOR_BG = '#000';
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

Game.UIMode.gameStart = {
  enter: function () {
    Game.Message.send("Welcome to WSRL");
    Game.refresh();
  },
  exit: function () {
    Game.refresh();
  },

  render: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,1,"game start",fg,bg);
    display.drawText(1,3,"press any key to continue",fg,bg);
  },

  handleInput: function (inputType,inputData) {
  //  console.log('gameStart inputType:');
  //  console.dir(inputType);
  //  console.log('gameStart inputData:');
  //  console.dir(inputData);
    if (inputData.charCode !== 0) { // ignore the various modding keys - control, shift, etc.
      Game.switchUiMode(Game.UIMode.gamePersistence);
    }
  }
};

Game.UIMode.gamePersistence = {
  RANDOM_SEED_KEY: 'gameRandomSeed',

  enter: function () {
    Game.refresh();
    //console.log('game persistence');
  },
  exit: function () {
    Game.refresh();
  },

  render: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,3,"press S to save the current game, L to load the saved game, or N start a new one",fg,bg);
//    console.log('TODO: check whether local storage has a game before offering restore');
//    console.log('TODO: check whether a game is in progress before offering restore');
  },

  handleInput: function (inputType,inputData) {
  //  console.log('gameStart inputType:');
  //  console.dir(inputType);
  //  console.log('gameStart inputData:');
  //  console.dir(inputData);
    if (inputType == 'keypress'){
      var inputChar = String.fromCharCode(inputData.charCode);
      if (inputChar == 'S') { // ignore the various modding keys - control, shift, etc.
        this.saveGame();
      } else if (inputChar == 'L') {
        this.restoreGame();
      } else if (inputChar == 'N') {
        this.newGame();
      }
    } else if (inputType == 'keydown') {
      if (inputData.keyCode == 27) { //'Escape'
        Game.switchUiMode(Game.UIMode.gamePlay);
      }
    }
  },

  saveGame: function () {
    if (this.localStorageAvailable()) {
      Game.DATASTORE.GAME_PLAY = Game.UIMode.gamePlay.attr;
      Game.DATASTORE.MESSAGES = Game.Message.attr;
      window.localStorage.setItem(Game._PERSISTANCE_NAMESPACE,JSON.stringify(Game.DATASTORE));
      Game.switchUiMode(Game.UIMode.gamePlay);
    }
  },
  restoreGame: function () {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);
      console.log('state data: ');
      console.dir(state_data);

      //game seed
      Game.setRandomSeed(state_data[this.RANDOM_SEED_KEY]);

      //maps
      for (var mapId in state_data.MAP) {
        if (state_data.MAP.hasOwnProperty(mapId)) {
          var mapAttr = JSON.parse(state_data.MAP[mapId]);
          console.log("restoring map " + mapId + " with attributes:");
          console.dir(mapAttr);
          Game.DATASTORE.MAP[mapId] = new Game.Map(mapAttr._tileSetName);
          Game.DATASTORE.MAP[mapId].fromJSON(state_data.MAP[mapId]);
        }
      }

      //entities
      for (var entityId in state_data.ENTITY) {
        if (state_data.ENTITY.hasOwnProperty(entityId)) {
          var entityAttr = JSON.parse(state_data.ENTITY[entityId]);
          Game.DATASTORE.ENTITY[entityId] = Game.EntityGenerator.generate(entityAttr._generator_template_key);
          Game.DATASTORE.ENTITY[entityId].fromJSON(state_data.ENTITY[entityId]);
        }
      }

      //gameplay
      Game.UIMode.gamePlay.attr = state_data.GAME_PLAY;
      Game.Message.attr = state_data.MESSAGES;
      Game.switchUiMode(Game.UIMode.gamePlay);
    }
  },
  newGame: function () {
    Game.setRandomSeed(5 + Math.floor(Game.RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupNewGame();
    Game.switchUiMode(Game.UIMode.gamePlay);
  },
  localStorageAvailable: function () { // NOTE: see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  	try {
  		var x = '__storage_test__';
  		window.localStorage.setItem( x, x);
  		window.localStorage.removeItem(x);
  		return true;
  	}
  	catch(e) {
      Game.Message.send('Sorry, no local data storage is available for this browser');
  		return false;
  	}
  },
  BASE_toJSON: function(state_hash_name) {
    var state = this.attr;
    if (state_hash_name) {
      state = this[state_hash_name];
    }
    var json = JSON.stringify(state);
    // for (var at in state) {
    //   if (state.hasOwnProperty(at)) {
    //     if (state[at] instanceof Object && '' in state[at]) {
    //       json[at] = state[at].toJSON();
    //     } else {
    //       json[at] = state[at];
    //     }
    //   }
    // }
    return json;
  },
  BASE_fromJSON: function (json,state_hash_name) {
    var using_state_hash = 'attr';
    if (state_hash_name) {
      using_state_hash = state_hash_name;
    }
    this[using_state_hash] = JSON.parse(json);
    // for (var at in this[using_state_hash]) {
    //   if (this[using_state_hash].hasOwnProperty(at)) {
    //     if (this[using_state_hash][at] instanceof Object && 'fromJSON' in this[using_state_hash][at]) {
    //       this[using_state_hash][at].fromJSON(json[at]);
    //     } else {
    //       this[using_state_hash][at] = json[at];
    //     }
    //   }
    // }
  }
};

Game.UIMode.gamePlay = {
  attr: {
    _mapId: '',
    _cameraX: 100,
    _cameraY: 100,
    _avatarId: ''
  },
  JSON_KEY: 'uiMode_gamePlay',
  enter: function () {
    //console.log('game playing');
    //Game.Message.clear();
    if (this.attr._avatarId) {
      this.setCameraToAvatar;
    }
    Game.refresh();
  },
  exit: function () {
    Game.refresh();
  },

  render: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    this.getMap().renderOn(display,this.attr._cameraX,this.attr._cameraY);
    display.drawText(1,1,"game play",fg,bg); // DEV
    this.renderAvatar(display);
  },
  renderAvatar: function (display) {
    Game.Symbol.AVATAR.draw(display,this.getAvatar().getX(),
                                    this.getAvatar().getY());
  },
  renderAvatarInfo: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.getAvatar().getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.getAvatar().getY(),fg,bg); // DEV
  },
  moveAvatar: function (dx,dy) {
    if (this.getAvatar().tryWalk(this.getMap(),dx,dy)) {
      this.setCameraToAvatar();
    }
  },
  moveCamera: function (dx,dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },
  setCamera: function (sx,sy) {
    this.attr._cameraX = Math.min(Math.max(0,sx),this.getMap().getWidth());
    this.attr._cameraY = Math.min(Math.max(0,sy),this.getMap().getHeight());
    Game.refresh();
  },
  setCameraToAvatar: function () {
    this.setCamera(this.getAvatar().getX(),this.getAvatar().getY());
  },
  handleInput: function (inputType,inputData) {
    var pressedKey = inputData.key;
    if (inputType == 'keypress') {
      //Game.Message.send("you pressed the '"+String.fromCharCode(inputData.charCode)+"' key");
      console.log('gamePlay inputType:'); // DEV
      console.dir(inputType);
      console.log('gamePlay inputData:');
      console.dir(inputData);
      if (pressedKey == '1') {
        this.moveAvatar(-1,1);
      } else if (pressedKey == '2') {
        this.moveAvatar(0,1);
      } else if (pressedKey == '3') {
        this.moveAvatar(1,1);
      } else if (pressedKey == '4') {
        this.moveAvatar(-1,0);
      } else if (pressedKey == '6') {
        this.moveAvatar(1,0);
      } else if (pressedKey == '7') {
        this.moveAvatar(-1,-1);
      } else if (pressedKey == '8') {
        this.moveAvatar(0,-1);
      } else if (pressedKey == '9') {
        this.moveAvatar(1,-1);
      } else if (pressedKey == '=') {
        Game.switchUiMode(Game.UIMode.gamePersistence);
        return;
      }
      Game.Message.ageMessages();
    }
    else if (inputType == 'keydown') {
      // console.log('gameStart inputType:');
      // console.dir(inputType);
      // console.log('gameStart inputData:');
      // console.dir(inputData);
      if (inputData.keyCode == 37) { // 'ArrowLeft'
        this.moveAvatar(-1,0);
      } else if (inputData.keyCode == 38) { // 'ArrowUp'
        this.moveAvatar(0,-1);
      } else if (inputData.keyCode == 39) { // 'ArrowRight'
        this.moveAvatar(1,0);
      } else if (inputData.keyCode == 40) { // 'ArrowDown'
        this.moveAvatar(0,1);
      }
    }
  },

  getMap: function () {
    return Game.DATASTORE.MAP[this.attr._mapId];
  },

  setMap: function (map) {
    this.attr._mapId = map.getId();
  },

  getAvatar: function () {
    return Game.DATASTORE.ENTITY[this.attr._avatarId];
  },

  setAvatar: function (avatar) {
    this.attr._avatarId = avatar.getId();
  },

  setupNewGame: function () {
    this.setMap(new Game.Map('caves1'));
    this.setAvatar(Game.EntityGenerator.generate('avatar'));

    var curPos = this.getMap().getRandomWalkableLocation();
    this.getMap().addEntity(this.getAvatar(),curPos);
    this.getAvatar().setPos(curPos);

    this.setCameraToAvatar();

    //populate
    for (var entityCount = 0; entityCount < 80; entityCount++) {
      this.getMap().addEntity(Game.EntityGenerator.generate('moss'),this.getMap().getRandomWalkableLocation());
    }
  },

  toJSON: function() {
    return Game.UIMode.gamePersistence.BASE_toJSON.call(this);
  },
  fromJSON: function (json) {
    Game.UIMode.gamePersistence.BASE_fromJSON.call(this,json);
  }
};

Game.UIMode.gameWin = {
  enter: function () {
    console.log('game winning');
  },
  exit: function () {
  },
  render: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,1,"You WON!!!!",fg,bg);
  },
  handleInput: function (inputType,inputData) {
    // console.log('gameStart inputType:');
    // console.dir(inputType);
    // console.log('gameStart inputData:');
    // console.dir(inputData);
    Game.Message.clear();
  }
};

Game.UIMode.gameLose = {
  enter: function () {
    console.log('game losing');
  },
  exit: function () {
  },
  render: function (display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,1,"You lost :(",fg,bg);
  },
  handleInput: function (inputType,inputData) {
    // console.log('gameStart inputType:');
    // console.dir(inputType);
    // console.log('gameStart inputData:');
    // console.dir(inputData);
    Game.Message.clear();
  }
};
