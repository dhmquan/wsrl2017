console.log("game.js loaded");

window.onload = function() {
  console.log("starting WSRL - window loaded");
  //Check if rot.js can work on this browser
  if(!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
  } else {
    // Initialize the game
    Game.init();

    document.getElementById('wsrl-main-display').appendChild(Game.display.main.o.getContainer());
  }
};

var Game = {
  display: {
    main: {
      w: 80,
      h: 40,
      o: null
    }
  },
  init: function() {
    console.log("game init");
    this.display.main.o = new ROT.Display(
      {width: this.display.main.w,
        height: this.display.main.h}
    );

    for (var i = 0; i < 10; i++ ) {
      this.display.main.o.drawText(5,i+5,"hello world");
    }
  }
};
