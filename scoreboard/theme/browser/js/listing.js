if(window.Scoreboard === undefined){
  var Scoreboard = {
    version: '1.0'
  };
}

Scoreboard.Events = {
  sorted: 'scoreboard-sorted'
};

Scoreboard.Listing = function(context, options){
  var self = this;
  self.context = context;

  self.settings = {
    items: '.scoreboard-datacubes-listing-item',
    action: 'folder_moveitem'
  };

  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

Scoreboard.Listing.prototype = {
  initialize: function(){
    var self = this;

    var items = jQuery(self.settings.items, self.context);
    var parent = items.data('parent') ? items.data('parent') + '/' : '';
    self.settings.action = parent + self.settings.action;

    items.attr('title', 'Click and drag to reorder');
    items.each(function(idx, item){
      jQuery(item).data('order', idx);
    });

    self.context.sortable({
      items: self.settings.items,
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
        url: self.settings.action,
        data: query,
        traditional: true,
        complete: function(){
          jQuery(document).trigger(Scoreboard.Events.sorted);
        }
    });
  }
};

jQuery.fn.ScoreboardListing = function(options){
  return this.each(function(){
    var context = jQuery(this);
    var adapter = new Scoreboard.Listing(context, options);
    context.data('ScoreboardListing', adapter);
  });
};

// On document ready
jQuery(document).ready(function(){

  // Enhance datacubes listing
  var items = jQuery('.scoreboard-datacubes-listing');
  if(items.length){
    items.ScoreboardListing({
      items: '.scoreboard-datacubes-listing-item',
      action: 'folder_moveitem'
    });
  }

  // Enhance visualizations listing

});
