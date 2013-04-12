if(window.Scoreboard === undefined){
  var Scoreboard = {
    version: '1.0'
  };
}

Scoreboard.Events = {
  cubesSorted: 'scoreboard-datacubes-sorted',
  visualizationsSored: 'scoreboard-visualizations-sorted'
};

// Datacubes Listing
Scoreboard.DatacubesListing = function(context, options){
  var self = this;
  self.context = context;

  self.settings = {
    sortItems: '.scoreboard-datacubes-listing-item',
    sortAction: 'folder_moveitem'
  };

  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

Scoreboard.DatacubesListing.prototype = {
  initialize: function(){
    var self = this;

    self.context.addClass('scoreboard-listing-enhanced');
    var items = jQuery(self.settings.sortItems, self.context);
    var parent = items.data('parent') ? items.data('parent') + '/' : '';
    self.settings.sortAction = parent + self.settings.sortAction;

    items.each(function(idx, item){
      jQuery(item).data('order', idx);
      jQuery(item).addClass('scoreboard-listing-item-enhanced');
    });

    self.context.sortable({
      items: self.settings.sortItems,
      placeholder: 'ui-state-highlight',
      forcePlaceholderSize: true,
      opacity: 0.7,
      delay: 300,
      cursor: 'crosshair',
      tolerance: 'pointer',
      update: function(event, ui){
        self.sort(ui.item, parent);
      }
    });
  },

  sort: function(context, parent){
    var self = this;

    var delta = context.index() - context.data('order');

    var query = {
      delta: delta,
      item_id: context.data('name')
    };

    $.ajax({
        type: 'POST',
        url: self.settings.sortAction,
        data: query,
        traditional: true,
        complete: function(){
          jQuery(document).trigger(Scoreboard.Events.cubesSorted);
        }
    });
  }
};

// Visualizations listing
Scoreboard.VisualizationsListing = function(context, options){
  var self = this;
  self.context = context;

  self.settings = {
    sortItems: '.scoreboard-visualizations-listing-item',
    sortAction: 'visualizations.sort'
  };

  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

Scoreboard.VisualizationsListing.prototype = {
  initialize: function(){
    var self = this;

    self.context.addClass('scoreboard-listing-enhanced');
    var items = jQuery(self.settings.sortItems, self.context);
    var parent = items.data('parent') ? items.data('parent') + '/' : '';
    self.settings.sortAction = parent + self.settings.sortAction;

    items.each(function(idx, item){
      jQuery(item).data('order', idx);
      jQuery(item).addClass('scoreboard-listing-item-enhanced');
    });

    self.context.sortable({
      items: self.settings.sortItems,
      placeholder: 'ui-state-highlight',
      forcePlaceholderSize: true,
      opacity: 0.7,
      delay: 300,
      cursor: 'crosshair',
      tolerance: 'pointer',
      update: function(event, ui){
        self.sort(ui.item, parent);
      }
    });
  },

  sort: function(context, parent){
    var self = this;

    var delta = context.index() - context.data('order');

    var query = {
      order: self.context.sortable('toArray')
    };

    $.ajax({
        type: 'POST',
        url: self.settings.sortAction,
        data: query,
        traditional: true,
        complete: function(){
          jQuery(document).trigger(Scoreboard.Events.visualizationsSored);
        }
    });
  }
};

// jQuery plugins
jQuery.fn.ScoreboardDatacubesListing = function(options){
  return this.each(function(){
    var context = jQuery(this);
    var adapter = new Scoreboard.DatacubesListing(context, options);
    context.data('ScoreboardDatacubesListing', adapter);
  });
};

jQuery.fn.ScoreboardVisualizationsListing = function(options){
  return this.each(function(){
    var context = jQuery(this);
    var adapter = new Scoreboard.VisualizationsListing(context, options);
    context.data('ScoreboardVisualizationsListing', adapter);
  });
};


// On document ready
jQuery(document).ready(function(){

  var items;
  // Enhance datacubes listing
  items = jQuery('.scoreboard-datacubes-listing');
  if(items.length){
    items.ScoreboardDatacubesListing({
      sortItems: '.scoreboard-datacubes-listing-item',
      sortAction: 'folder_moveitem'
    });
  }

  // Enhance visualizations listing
  items = jQuery('.scoreboard-visualizations-listing');
  if(items.length){
    items.ScoreboardVisualizationsListing({
      sortItems: '.scoreboard-visualizations-listing-item',
      sortAction: 'visualizations.sort'
    });
  }

});
