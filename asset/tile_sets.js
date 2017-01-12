Game.TileSets = {
  caves1: {
    _width: 75,
    _height: 50,

    getTiles: function () {
      var tiles = Game.util.init2DArray(this._width,this._height,Game.Tile.nullTile);
      var generator = new ROT.Map.Cellular(this._width,this._height);
      generator.randomize(0.5);

      //repeated cellular automata process
      var totalIterations = 3;
      for (var i = 0; i< totalIterations - 1; i++) {
        generator.create();
      }

      //run generator again to create map
      generator.create(function(x,y,val) {
        if (v === 1) {
          tiles[x][y] = Game.Tile.floorTile;
        } else {
          tiles[x][y] = Game.Tile.wallTile;
        }
      });

      return tiles;
    }
  }
};
