/**
  * Our ViewModel for the Admin page
  *
  */
var AdminViewModel = (function() {
  Spaces.setAllModels();
  Users.setAllModels();

  // Give KO some time to render
  var updateTooltip = _.debounce(function(){
    $('[data-toggle="tooltip"]').tooltip();
  }, 100);

  // Whenever our filtering changes we need to re-bind tooltips
  // as they've been removed from the DOM
  Spaces.allFiltered.subscribe(function(spaces) {
    updateTooltip();
  });

  return {
    spaces: Spaces,
    users: Users
  };
})();

$(document).ready(function() {
  // Initialize KnockoutJS with our ViewModel
  ko.applyBindings(AdminViewModel);
});
