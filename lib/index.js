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
  deleteModel: function(model) {
    var self = this;
    self.dataSource.deleteById(model.id).then(function() {
      self.all.remove(model);
      delete self.cache[model.id];
    });
  },
  newModel: function(item) {
    var self = this;
    var model = new self.model(self.newDefaults);
    model.edit(model);
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
  },
  submitModel: function(editableModel) {
    var self = this;
    self.saveToDataSource(editableModel).then(function(data) {
      self.getModelById(data.id).then(function(model) {
        model.update(data);
        self.editableModel(null);
        self.editing(false);
        $(self.editSelector).modal('hide');
      });
    });
  },
  editModel: function(model) {
    var editableModel = new this.model(model.data);
    this.editableModel(editableModel);
    this.editing(true);
    $(this.editSelector).modal('show');
  },
  saveToDataSource: function(model) {
    var self = this;
    if (typeof model.id == "undefined") {
      return self.dataSource.create(model.generateData());
    } else {
      return self.dataSource.updateById(model.id, model.generateData());
    }
  }
};

var Users = {
  cache: {},
  dataSource: Data.User,
  model: UserModel,
  getModelById: Utils.getModelById,
  setModel: Utils.setModel,
  setAllModels: Utils.setAllModels,
  all: ko.observableArray()
};

var Spaces = {
  cache: {},
  dataSource: Data.Space,
  model: SpaceModel,
  getModelById: Utils.getModelById,
  deleteModel: Utils.deleteModel,
  newModel: Utils.newModel,
  setModel: Utils.setModel,
  setAllModels: Utils.setAllModels,
  editModel: Utils.editModel,
  submitModel: Utils.submitModel,
  saveToDataSource: Utils.saveToDataSource,
  newSelector: '#space-new',
  editSelector: '#space-edit',
  all: ko.observableArray(),
  editing: ko.observable(false),
  editableModel: ko.observable(),
  newDefaults: {
    title: "New Space",
    description: "",
    created_by: 1,
    members: [],
    private: true,
    welcome: false,
    featured: false
  }
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
