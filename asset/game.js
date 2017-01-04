console.log("hello?");

window.onload = function() {
    console.log("starting WSRL - window loaded");
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        // Initialize the game
        Game.init();

        // Add the containers to our HTML page
        document.getElementById('wsrl-avatar-display').appendChild(Game.getDisplay('avatar').getContainer());
        document.getElementById('wsrl-main-display').appendChild(Game.getDisplay('main').getContainer());
        document.getElementById('wsrl-message-display').appendChild(Game.getDisplay('message').getContainer());

        Game.switchUIMode(Game.UIMode.gameStart);
    }
};

var Game = {

  _randomSeed: 0,
  _DISPLAY_SPACING: 1.1,
  display: {
    main: {
      w: 80,
      h: 24,
      o: null
    },

    avatar: {
      w: 20,
      h: 24,
      o: null
    },

    message: {
      w: 100,
      h: 6,
      o: null
    }
  },

  _curUIMode: null,

  init: function() {
    this._randomSeed = 5 + Math.floor(Math.random()*100000);
    //this._randomSeed = 76250;
    console.log("using random seed "+this._randomSeed);
    ROT.RNG.setSeed(this._randomSeed);

    for (var display_key in this.display){
      this.display[display_key].o = new ROT.Display({
        width: this.display[display_key].w,
        height: this.display[display_key].h,
        spacing: Game._DISPLAY_SPACING});
    }

    console.dir(this.display);
  },

  getDisplay: function (displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  renderAll: function() {
    this.renderAvatar();
    this.renderMain();
    this.renderMessage();

  },

  renderAvatar: function() {
    var d = this.getDisplay("avatar");
    d.drawText(2,2,"avatar display");
  },

  renderMain: function() {
    this._curUIMode.render(this.getDisplay("main"));
    //var d = this.getDisplay("main");
      //d.drawText(5,5,"main display");
  },

  renderMessage: function() {
    var d = this.getDisplay("message");
    d.drawText(1,1,"message display");
  },

  switchUIMode: function(newMode){
    //exit old mode
    if (this._curUIMode != null ) {
      this._curUIMode.exit();
    }
    //set up new mode
    this._curUIMode = newMode;
    //enter new mode
    if (this._curUIMode != null ) {
      this._curUIMode.enter();
    }
    //render everything
    this.renderAll();
  }
};
