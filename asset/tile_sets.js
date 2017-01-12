Game.TileSets = {
  caves1: {
    _width: 300,
    _height: 200,

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
        if (val === 1) {
          tiles[x][y] = Game.Tile.floorTile;
        } else {
          tiles[x][y] = Game.Tile.wallTile;
        }
      });

      return tiles;
    }
  }
};
