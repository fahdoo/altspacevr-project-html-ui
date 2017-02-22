/**
  * Define our Users model
  *
  */
var Users = {
  cache: {},
  dataSource: Data.User,
  model: UserModel,
  getModelById: Utils.getModelById,
  setModel: Utils.setModel,
  setAllModels: Utils.setAllModels,
  all: ko.observableArray(),
  loaded: ko.observable(false)
};

/**
  * Define our User model
  *
  */
function UserModel(user) {
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

  self.image = "./images/image-" + self.id + ".png";
};
