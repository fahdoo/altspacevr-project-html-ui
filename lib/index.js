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
  deleteModel: function(editableModel) {
    var self = this;
    self.getModelById(editableModel.id).then(function(model) {
      self.dataSource.deleteById(model.id).then(function() {
        self.all.remove(model);
        delete self.cache[model.id];
        $(self.editSelector).modal('hide');
      });
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
    return self.dataSource.getAll().then(function(items) {
      for (i = 0; i < items.length; i++) {
        self.setModel(items[i]);
      }
      self.loaded(true);
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
  },
  deleteSelected: function() {
    var self = this;
    function _delete(model, id) {
      self.dataSource.deleteById(id).then(function() {
        self.all.remove(model);
        delete self.cache[id];
      });
    }
    if(confirm("Are you sure you want to delete the selected spaces? This action is irreversible.")) {
      var selected = self.selected();
      for(i = 0; i < selected.length; i++) {
        var model = selected[i];
        var id = model.id;
        _delete(model, id);
      }
      self.selected.removeAll();
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
  all: ko.observableArray(),
  loaded: ko.observable(false)
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
  deleteSelected: Utils.deleteSelected,
  editSelector: '#space-edit-modal',
  query: ko.observable(),
  all: ko.observableArray(),
  selected: ko.observableArray(),
  editing: ko.observable(false),
  editableModel: ko.observable(),
  loaded: ko.observable(false),
  viewMode: ko.observable('cards'),
  activeTemplate: ko.pureComputed(function() {
    if (Spaces.viewMode() == 'cards') {
      return 'spaces-cards-template';
    } else if (Spaces.viewMode() == 'table') {
      return 'spaces-table-template';
    }
  }),
  allFiltered: ko.pureComputed(function() {
    var query = Spaces.query();
    if (typeof query != 'undefined' && query !== '') {
      var regexp = new RegExp(query, 'i');
      return _.filter(Spaces.all(), function(space) {
        var words = space.title() +
                    space.description() +
                    space.createdBy().fullName() +
                    space.tags().join('');
        return words.search(regexp) > -1;
      });
    } else {
      return Spaces.all();
    }
  }),
  newDefaults: {
    title: "New Space",
    description: "",
    created_by: 1,
    members: [],
    tags: [],
    private: true,
    welcome: false,
    featured: false
  }
};

var AdminViewModel = (function() {
  Spaces.setAllModels();
  Users.setAllModels();

  // Give KO some time to render
  var updateTooltip = _.debounce(function(){
    $('[data-toggle="tooltip"]').tooltip();
  }, 100);

  Spaces.allFiltered.subscribe(function(spaces) {
    updateTooltip();
  });

  return {
    spaces: Spaces,
    users: Users
  };
})();

$(document).ready(function() {
  ko.applyBindings(AdminViewModel);
});
