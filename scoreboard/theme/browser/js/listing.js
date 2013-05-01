if(window.Scoreboard === undefined){
  var Scoreboard = {
    version: '1.0'
  };
}

Scoreboard.Confirm = {
  initialize: function(){
    var self = this;
    self.event = null;
    self.kwargs = {};

    self.area = jQuery('<div>').addClass('scoreboard-confirm').attr('title', 'Confirm');
    jQuery('body').after(self.area);
    self.area.dialog({
      bgiframe: true,
      autoOpen: false,
      modal: true,
      dialogClass: 'scoreboard-confirm-overlay',
      open: function(evt, ui){
        jQuery(this).parent().addClass('bootstrap');
        var buttons = jQuery(this).parent().find('button');
        buttons.attr('class', 'btn');
        jQuery(buttons[0]).addClass('btn-danger');
        jQuery(buttons[1]).addClass('btn-inverse');
      },
      buttons:  {
        Yes: function(){
          if(self.event !== null){
            jQuery(document).trigger(self.event, self.kwargs);
          }
          jQuery(this).dialog('close');
        },
        No: function(){
          jQuery(this).dialog('close');
        }
      }
    });
  },

  confirm: function(msg, event, kwargs){
    var self = this;
    self.area.html(msg);
    self.event = event;
    self.kwargs = kwargs;
    self.area.dialog('open');
  }
};

Scoreboard.Events = {
  cubesSorted: 'scoreboard-datacubes-sorted',
  cubeDelete: 'scoreboard-datacube-delete',
  cubeDeleted: 'scoreboard-datacube-deleted',
  visualizationsSorted: 'scoreboard-visualizations-sorted',
  visualizationDelete: 'scoreboard-visualization-delete',
  visualizationDeleted: 'scoreboard-visualization-deleted'
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
      item = jQuery(item);
      item.data('order', idx);
      return self.initializeItem(item);
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

    // Events
    jQuery(document).unbind('.DatacubesListing');
    jQuery(document).bind(Scoreboard.Events.cubeDelete + '.DatacubesListing', function(evt, data){
      return self.deleteItem(data);
    });

  },

  initializeItem: function(item){
    var self = this;
    item.addClass('scoreboard-listing-item-enhanced');

    // Publish
    jQuery("a[href*='content_status_modify']", item).click(function(evt){
      evt.preventDefault();
      var href = jQuery(this).attr('href');
      jQuery.ajax({
        type: 'GET',
        url: href,
        traditional: true,
        complete: function(data){
          document.location.reload();
        }
      });
    });

    // Delete
    jQuery("a[href*='delete_confirmation']", item).click(function(evt){
      evt.preventDefault();
      msg = 'Are you sure you want to delete "' + (item.data('title') || 'this item') + '"?';
      Scoreboard.Confirm.confirm(msg, Scoreboard.Events.cubeDelete, {
        item: item,
        action: jQuery(this).attr('href')
      });
    });
  },

  deleteItem: function(options){
    var self = this;
    var authenticator = jQuery(options.item.data('authenticator'));
    var query = {'form.submitted': 1};
    query[authenticator.attr('name')] = authenticator.val();
    jQuery.ajax({
        type: 'POST',
        url: options.action,
        data: query,
        traditional: true,
        complete: function(){
          jQuery(document).trigger(Scoreboard.Events.cubeDeleted);
        }
    });
    options.item.hide('highlight', {}, 1000, function(){
      options.item.remove();
    });
  },

  sort: function(context, parent){
    var self = this;

    var delta = context.index() - context.data('order');

    var query = {
      delta: delta,
      item_id: context.data('name')
    };

    jQuery.ajax({
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
      item = jQuery(item);
      item.data('order', idx);
      return self.initializeItem(item);
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

    // Events
    jQuery(document).unbind('.VisualizationsListing');
    jQuery(document).bind(Scoreboard.Events.visualizationDelete + '.VisualizationsListing', function(evt, data){
      return self.deleteItem(data);
    });

  },

  initializeItem: function(item){
    var self = this;
    item.addClass('scoreboard-listing-item-enhanced');

    // Publish
    jQuery("a[href*='content_status_modify']", item).click(function(evt){
      evt.preventDefault();
      var href = jQuery(this).attr('href');
      jQuery.ajax({
        type: 'GET',
        url: href,
        traditional: true,
        complete: function(data){
          document.location.reload();
        }
      });
    });

    // Delete
    jQuery("a[href*='delete_confirmation']", item).click(function(evt){
      evt.preventDefault();
      msg = 'Are you sure you want to delete "' + (item.data('title') || 'this item') + '"?';
      Scoreboard.Confirm.confirm(msg, Scoreboard.Events.visualizationDelete, {
        item: item,
        action: jQuery(this).attr('href')
      });
    });
  },

  deleteItem: function(options){
    var self = this;
    var authenticator = jQuery(options.item.data('authenticator'));
    var query = {'form.submitted': 1};
    query[authenticator.attr('name')] = authenticator.val();
    jQuery.ajax({
        type: 'POST',
        url: options.action,
        data: query,
        traditional: true,
        complete: function(){
          jQuery(document).trigger(Scoreboard.Events.visualizationDeleted);
        }
    });
    options.item.hide('highlight', {}, 1000, function(){
      options.item.remove();
    });
  },

  sort: function(context, parent){
    var self = this;

    var delta = context.index() - context.data('order');

    var query = {
      order: self.context.sortable('toArray')
    };

    jQuery.ajax({
        type: 'POST',
        url: self.settings.sortAction,
        data: query,
        traditional: true,
        complete: function(){
          jQuery(document).trigger(Scoreboard.Events.visualizationsSorted);
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

  // Change 'related content' label
  items = jQuery('#relatedItemBox dt');
  if(items.length){
    items.html('Dataset:');
  }

  Scoreboard.Confirm.initialize();
});
