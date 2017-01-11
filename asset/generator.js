//constructor takes a Game.Entity, defaultTemplate takes a Game.EntityTemplates
Game.Generator = function (genName, constrFuction, defaultTemplate) {
  this._name = genName;
  this._constructor = constrFuction;

  this._templates = {};
  this._templates._DEFAULT = defaultTemplate || {};
};

Game.Generator.prototype.learn = function (template, templateName) {
  if (! template.name) {
    console.log("generator " + this._name + " can't learn a template that has no name attribute:");
    console.dir(template);
    return false;
  }
  templateName = templateName || template.name;
  this._templates[templateName] = template;
};

Game.Generator.prototype.generate = function (templateName) {
  var template = this._templates[templateName];
  if (!template) {template = '_DEFAULT';}
  template.generator_template_key = templateName;
  return new this._constructor(template);
};
