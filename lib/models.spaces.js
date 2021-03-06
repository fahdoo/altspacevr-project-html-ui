/**
  * Define our Spaces model
  *
  */
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
  // Edit/New Space modal selector
  editSelector: '#space-edit-modal',
  // Set up KnockoutJS observables
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
  // When creating a new space, these will be the defaults
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

/**
  * Define our Space model
  *
  */
function SpaceModel(space) {
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
  self.tags = ko.observableArray();
  self.tagsInput = ko.computed({
    read: function() {
      return self.tags().join(',');
    },
    write: function(tagString) {
      self.tags(_.filter(tagString.split(','), function(tag) {
        return tag !== '';
      }));
    }
  });

  self.classes = ko.computed(function() {
    var classes = [];
    if (self.welcome()) {
      classes.push('card-inverse', 'card-welcome');
    }
    if (self.featured()) {
      classes.push('card-inverse', 'card-warning');
    }
    return classes.join(" ");
  });

  self.canSave = ko.computed(function() {
    return !_.isEmpty(self.title());
  });

  self.update(space);
}

SpaceModel.prototype.generateData = function() {
  var data = {
    id: this.id,
    title: this.title(),
    description: this.description(),
    welcome: this.welcome(),
    private: this.private(),
    featured: this.featured(),
    created_by: (this.createdBy() || {}).id,
    members: _.map(this.members(), 'id'),
    tags: this.tags(),
  };
  return data;
};

SpaceModel.prototype.update = function(space) {
  var self = this;
  self.id = space.id;
  self.data = space;
  self.title(space.title); // String
  self.description(space.description); // String
  self.welcome(space.welcome); // Boolean
  self.private(space.private); // Boolean
  self.featured(space.featured); // Boolean
  self.tags(space.tags || []);

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

SpaceModel.prototype.clearMembers = function() {
  this.members.removeAll();
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
