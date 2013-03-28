if(window.scoreboard === undefined){
    var scoreboard = {
        version: '1.0'
    };
};

if(scoreboard.theme === undefined){
    scoreboard.theme = {};
};

scoreboard.theme.listing = {
    makeTabs: function(){
        jQuery("ul.tabs").tabs("div.panes > div", {
            'tabs': 'li',
            'current': 'active'
        });
    }
};

jQuery(document).ready(function(){
    scoreboard.theme.listing.makeTabs();
});
