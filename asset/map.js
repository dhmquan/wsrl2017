Game.DATASTORE.MAP = {};

Game.Map = function (tileSetName) {
  console.log("setting up new map using " + tileSetName + " tileset");
  this._tiles = Game.TileSets[tileSetName].getTiles();

  this.attr = {
    _id: Game.util.randomString(32),
    _tileSetName: tileSetName,
    _width: this._tiles.length,
    _height: this._tiles[0].length,
    _entitiesByPosition: {},
    _positionsByEntity: {}
  };
  Game.DATASTORE.MAP[this.attr._id] = this;
};

Game.Map.prototype.getId = function () {
  return this.attr._id;
};

Game.Map.prototype.getWidth = function () {
  return this.attr._width;
};

Game.Map.prototype.getHeight = function () {
  return this.attr._height;
};

Game.Map.prototype.getTile = function (x_or_pos,y) {
  var useX = x_or_pos, useY = y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  if ((useX < 0) || (useX >= this.attr._width) || (useY<0) || (useY >= this.attr._height)) {
    return Game.Tile.nullTile;
  }
  return this._tiles[useX][useY] || Game.Tile.nullTile;
};

Game.Map.prototype.addEntity = function (entity, pos) {
  this.attr._entitiesByPosition[pos.x + "," + pos.y] = entity.getId();
  this.attr._positionsByEntity[entity.getId()] = pos.x + "," + pos.y;
  entity.setMap(this);
};

Game.Map.prototype.getEntity = function (x_or_pos,y) {
  var useX = x_or_pos, useY = y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  var entityId = this.attr._entitiesByPosition[useX + "," + useY];
  if (entityId) {return Game.DATASTORE.ENTITY[entityId];}
  return false;
};

Game.Map.prototype.updateEntityPosition = function (entity) {
  //erase old image in old position
  var curPos = this.attr._positionsByEntity[entity.getId()];
  if (curPos) {
    this.attr._entitiesByPosition[curPos] = undefined;
  }
  //create new image in new position
  var pos = entity.getPos();
  this.attr._entitiesByPosition[pos.x + "," + pos.y] = entity.getId();
  this.attr._positionsByEntity[entity.getId()] = pos.x + "," + pos.y;
};

Game.Map.prototype.getRandomLocation = function(filter_func) {
  if (filter_func === undefined) {
    filter_func = function(tile) { return true; };
  }
  var tX,tY,tile;
  do {
    tX = Game.util.randomInt(0,this.attr._width - 1);
    tY = Game.util.randomInt(0,this.attr._height - 1);
    tile = this.getTile(tX,tY);
  } while (! filter_func(tile));
  return {x:tX,y:tY};
};

Game.Map.prototype.getRandomWalkableLocation = function() {
  return this.getRandomLocation(function(tile){ return tile.isWalkable(); });
};

Game.Map.prototype.renderOn = function (display,camX,camY) {
  // console.log("display is ");
  // console.dir(display);
  var dispW = display._options.width;
  var dispH = display._options.height;
  var xStart = camX-Math.round(dispW/2);
  var yStart = camY-Math.round(dispH/2);
  for (var x = 0; x < dispW; x++) {
    for (var y = 0; y < dispH; y++) {
      // Fetch the glyph for the tile and render it to the screen - sub in wall tiles for nullTiles / out-of-bounds
      var pos = {x:x+xStart,y:y+yStart};
      var tile = this.getTile(pos);
      if (tile.getName() == 'nullTile') {
        tile = Game.Tile.wallTile;
      }
      tile.draw(display,x,y);

      var entity = this.getEntity(pos);
      if (entity) {
        entity.draw(display,x,y)
      }
    }
  }
};

Game.Map.prototype.toJSON = function () {
  var json = Game.UIMode.gamePersistence.BASE_toJSON.call(this);
  return json;
};
Game.Map.prototype.fromJSON = function (json) {
  Game.UIMode.gamePersistence.BASE_fromJSON.call(this,json);
};
