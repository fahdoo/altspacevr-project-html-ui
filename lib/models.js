var UserModel = function(user) {
  var self = this;
  self.data = user;
  self.id = user.id; // Number
  self.email = ko.observable(user.email); // String
  self.firstName = ko.observable(user.first_name); // String
  self.lastName = ko.observable(user.last_name); // String
  self.admin = ko.observable(user.admin); // Boolean

  self.fullName = ko.pureComputed(function() {
    return self.firstName() + " " + self.lastName();
  });
};

var SpaceModel = function(space) {
  var self = this;
  self.data = space;
  self.id = space.id; // Number
  self.title = ko.observable(); // String
  self.description = ko.observable(); // String
  self.welcome = ko.observable(); // Boolean
  self.private = ko.observable(); // Boolean
  self.featured = ko.observable(); // Boolean
  self.createdBy = ko.observable(); // Number
  self.members = ko.observableArray(); // Array

  self.update(space);
};

SpaceModel.prototype.generateData = function() {
  var data = {
    title: this.title(),
    description: this.description(),
    welcome: this.welcome(),
    private: this.private(),
    featured: this.featured(),
    created_by: this.createdBy().id,
    members: _.map(this.members(), 'id')
  };
  return data;
};

SpaceModel.prototype.update = function(space) {
  var self = this;
  self.data = space;
  self.title(space.title); // String
  self.description(space.description); // String
  self.welcome(space.welcome); // Boolean
  self.private(space.private); // Boolean
  self.featured(space.featured); // Boolean

  // Async updates to created_by and members
  Users.getModelById(space.created_by).then(function(userModel) {
    self.createdBy(userModel);
  });

  if(space.members !== null) {
    self.members.removeAll();
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

SpaceModel.prototype.remove = function() {
  // TODO: could replace with a nicer confirmation modal
  if(confirm("Are you sure you want to delete the space '" + this.title() + "'? This action is irreversible.")) {
    Spaces.deleteModel(this);
  }
};

SpaceModel.prototype.edit = function() {
  Spaces.editModel(this);
};

SpaceModel.prototype.submit = function() {
  Spaces.submitModel(this);
};
