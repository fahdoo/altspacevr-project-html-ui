/**
  * Utility functions that manipulate the models or dataSource
  * These can be thought of as "features" that a model can extend itself with
  */
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
