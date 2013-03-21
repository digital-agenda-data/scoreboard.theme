(function() {

var data = [
  {
    "cname": "Belgium",
    "value": 8656.0
  },
  {
    "cname": "Bulgaria",
    "value": 1607.0
  },
  {
    "cname": "Czech Republic",
    "value": 5099.0
  },
  {
    "cname": "Denmark",
    "value": 5446.0
  },
  {
    "cname": "Germany",
    "value": 59200.0
  },
  {
    "cname": "Estonia",
    "value": 697.0
  },
  {
    "cname": "Greece",
    "value": 6556.0
  },
  {
    "cname": "Spain",
    "value": 37273.0
  },
  {
    "cname": "France",
    "value": 53677.0
  },
  {
    "cname": "Ireland",
    "value": 4430.0
  },
  {
    "cname": "Italy",
    "value": 42298.0
  },
  {
    "cname": "Cyprus",
    "value": 580.0
  },
  {
    "cname": "Latvia",
    "value": 592.0
  },
  {
    "cname": "Lithuania",
    "value": 745.0
  },
  {
    "cname": "Luxembourg",
    "value": 509.0
  },
  {
    "cname": "Hungary",
    "value": 3228.0
  },
  {
    "cname": "Malta",
    "value": 223.0
  },
  {
    "cname": "Netherlands",
    "value": 11410.0
  },
  {
    "cname": "Austria",
    "value": 4906.0
  },
  {
    "cname": "Poland",
    "value": 10900.0
  },
  {
    "cname": "Portugal",
    "value": 5940.0
  },
  {
    "cname": "Romania",
    "value": 3633.0
  },
  {
    "cname": "Slovenia",
    "value": 1049.0
  },
  {
    "cname": "Slovak Republic",
    "value": 2206.0
  },
  {
    "cname": "Finland",
    "value": 4820.0
  },
  {
    "cname": "Sweden",
    "value": 8122.0
  },
  {
    "cname": "United Kingdom",
    "value": 43311.0
  }
];
var country_data = [
    {code: 'AT',   color: '#AABC66', label: "Austria"},
    {code: 'BE',   color: '#FD8245', label: "Belgium"},
    {code: 'BG',   color: '#21FF00', label: "Bulgaria"},
    {code: 'CY',   color: '#FF5400', label: "Cyprus"},
    {code: 'CZ',   color: '#1C3FFD', label: "Czech Republic"},
    {code: 'DE',   color: '#FFC600', label: "Germany"},
    {code: 'DK',   color: '#45BF55', label: "Denmark"},
    {code: 'EE',   color: '#0EEAFF', label: "Estonia"},
    {code: 'GR',   color: '#6A07B0', label: "Greece"},
    {code: 'ES',   color: '#044C29', label: "Spain"},
    {code: 'FI',   color: '#7FB2F0', label: "Finland"},
    {code: 'FR',   color: '#15A9FA', label: "France"},
    {code: 'HR',   color: '#33EED2', label: "Croatia"},
    {code: 'HU',   color: '#D40D12', label: "Hungary"},
    {code: 'IE',   color: '#ADF0F6', label: "Ireland"},
    {code: 'IS',   color: '#662293', label: "Iceland"},
    {code: 'IT',   color: '#19BC01', label: "Italy"},
    {code: 'LT',   color: '#9A24ED', label: "Lithuania"},
    {code: 'LU',   color: '#D50356', label: "Luxembourg"},
    {code: 'LV',   color: '#D59AFE', label: "Latvia"},
    {code: 'MT',   color: '#35478C', label: "Malta"},
    {code: 'NL',   color: '#FF40F4', label: "Netherlands"},
    {code: 'NO',   color: '#F70A9B', label: "Norway"},
    {code: 'PL',   color: '#FF1D23', label: "Poland"},
    {code: 'PT',   color: '#FFFC00', label: "Portugal"},
    {code: 'RO',   color: '#1B76FF', label: "Romania"},
    {code: 'SE',   color: '#436B06', label: "Sweden"},
    {code: 'SI',   color: '#648E23', label: "Slovenia"},
    {code: 'SK',   color: '#7DC30F', label: "Slovak Republic"},
    {code: 'TR',   color: '#9900AB', label: "Turkey"},
    {code: 'GB',   color: '#D000C4', label: "United Kingdom"},
];

var country_code = _.object(_(country_data).pluck('label'),
                            _(country_data).pluck('code'));
var country_name = _.object(_(country_data).pluck('code'),
                            _(country_data).pluck('label'));
var value_by_country = _.object(
    _(data).map(function(v) { return country_code[v['cname']]; }),
    _(data).pluck('value'));

colorscale = new chroma.ColorScale({
    colors: chroma.brewer['YlOrBr'],
    limits: [0, _(_(data).pluck('value')).max()]
});

var n = 0;
var map = Kartograph.map('#map');
map.setMap(COUNTRIES_EUROPE_SVG);
//map.loadMap('map-resources/countries_europe.svg', function() {
    map.addLayer('countries', {
        titles: function(feature) {
            return d.id;
        },
        styles: {
            stroke: '0.5px'
        },
        tooltips: function(feature) {
            var code = feature['code'];
            return [country_name[code],
                    value_by_country[code] || 'n/a'];
        }
    });
    map.getLayer('countries').style({
        fill: function(feature) {
            var value = value_by_country[feature['code']];
            if(_.isUndefined(value)) {
                return '#ccc';
            }
            else {
                return colorscale.getColor(value);
            }
        }
    });
//});

})();
