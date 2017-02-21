var Utils = {
  getModelById: function(id) {
    var self = this;
    if (typeof self.cache[id] !== "undefined") {
      return new Promise(function(fulfill) {
        fulfill(self.cache[id]);
      });
    } else {
      return self.dataSource.getById(id).then(self.setModel.bind(self));
    }
  },
  setModel: function(item) {
    var self = this;
    if (typeof self.cache[item.id] == "undefined") {
      self.cache[item.id] = new self.model(item);
      self.all.push(self.cache[item.id]);
    }
    return self.cache[item.id];
  },
  setAllModels: function() {
    var self = this;
    self.dataSource.getAll().then(function(items) {
      for (i = 0; i < items.length; i++) {
        self.setModel(items[i]);
      }
    });
  }
};

var Users = {
  cache: {},
  dataSource: Data.User,
  model: UserModel,
  all: ko.observableArray(),
  getModelById: Utils.getModelById,
  setModel: Utils.setModel,
  setAllModels: Utils.setAllModels
};

var Spaces = {
  cache: {},
  dataSource: Data.Space,
  model: SpaceModel,
  all: ko.observableArray(),
  getModelById: Utils.getModelById,
  setModel: Utils.setModel,
  setAllModels: Utils.setAllModels
};

var AdminViewModel = (function() {
  Spaces.setAllModels();
  Users.setAllModels();

  return {
    spaces: Spaces,
    users: Users
  };
})();

$(document).ready(function() {
  ko.applyBindings(AdminViewModel);
});
