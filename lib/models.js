var UserModel = function(user) {
  this.id = user.id; // Number
  this.email = ko.observable(user.email); // String
  this.first_name = ko.observable(user.first_name); // String
  this.last_name = ko.observable(user.last_name); // String
  this.admin = ko.observable(user.admin); // Boolean

  this.full_name = ko.computed(function() {
    return this.first_name() + " " + this.last_name();
  }, this);
};

var SpaceModel = function(space) {
  var self = this;
  self.id = space.id; // Number
  self.title = ko.observable(space.title); // String
  self.description = ko.observable(space.description); // String
  self.welcome = ko.observable(space.welcome); // Boolean
  self.private = ko.observable(space.private); // Boolean
  self.featured = ko.observable(space.featured); // Boolean
  self.created_by = ko.observable(); // Number
  self.members = ko.observableArray(); // Array

  // Async updates to created_by and members
  Users.getModelById(space.created_by).then(function(userModel) {
    self.created_by(userModel);
  });

  if(space.members !== null) {
    for (i = 0; i < space.members.length; i++) {
      self.setMember(space.members[i]);
    }
  }
};

SpaceModel.prototype.setMember = function(id) {
  Users.getModelById(id).then(function(userModel){
    this.members.push(userModel);
  }.bind(this));
};
