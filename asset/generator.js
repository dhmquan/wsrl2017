//constructor takes a Game.Entity, defaultTemplate takes a Game.EntityTemplates
Game.Generator = function (genName, constrFuction, defaultTemplate) {
  this._name = genName;
  this._constructor = constrFuction;

  this._templates = {};
  this._templates._DEFAULT = defaultTemplate || {};
};

Game.Generator.prototype.learn = function (templateName, template) {
  this._templates[templateName] = template;
};

Game.Generator.prototype.generate = function (templateName) {
  var template = this._templates[templateName];
  if (!template) {template = '_DEFAULT';}
  return new this._constructor(template);
};
