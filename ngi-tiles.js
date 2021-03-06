var map = L.map('map', {
  //center: [-28.5, 24.5],
  //zoom: 6,
  minZoom: 4,
  maxZoom: 15,
  //maxBounds: [[-34.85, 16.25], [-22, 33]]
});
map.fitBounds([[-34.85, 16.25], [-22, 33]]);

var fiftyk = L.tileLayer('tiles/50k/{z}/{x}/{y}.png', {
  tms: true,
  attribution: 'State Copyright &copy; 1996&ndash;2013 <a href="http://www.ngi.gov.za/">Chief Directorate: National Geo-spatial Information</a>'
}).addTo(map);

var twofiftyk = L.tileLayer('tiles/250k/{z}/{x}/{y}.png', {
  tms: true,
  maxNativeZoom: 12,
  attribution: 'State Copyright &copy; 1996&ndash;2010 <a href="http://www.ngi.gov.za/">Chief Directorate: National Geo-spatial Information</a>'
});

var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Copyright &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  opacity: 0.5
});

var layerControl = L.control.layers({
  "1:50 000 topo": fiftyk,
  "1:250 000 topo": twofiftyk
}, {
  "OpenStreetMap": osm,
}).addTo(map);

map.on('baselayerchange', function (e) {
  console.log(e.name);
  if (e.name == "1:250 000 topo") {
    $('img#key-img').attr('src', 'key-250k.png');
  } else {
    $('img#key-img').attr('src', 'key-50k.png');
  }
});

$.getJSON('sheet50k.json', function (data) {
  var sheets = L.geoJson(data, {
    style: {
      stroke: true, color: 'black', weight: 2, opacity: 1,
      fill: true, fillColor: 'lightblue', fillOpacity: 0
    },
    onEachFeature: function (feature, layer) {
      var props = feature.properties;
      layer.bindPopup('Sheet ' + props.s + '<br/>Ed. ' + props.e + ' (' + props.y + ')');
    }
  });

  layerControl.addOverlay(sheets, "1:50k sheet info");
});

$.getJSON('sheet250k.json', function (data) {
  var sheets = L.geoJson(data, {
    style: {
      stroke: true, color: 'black', weight: 2, opacity: 1,
      fill: true, fillColor: 'lightblue', fillOpacity: 0
    },
    onEachFeature: function (feature, layer) {
      var props = feature.properties;
      layer.bindPopup('Sheet ' + props.s + '<br/>Ed. ' + props.e + ' (' + props.y + ')');
    }
  });

  layerControl.addOverlay(sheets, "1:250k sheet info");
});

var hash = new L.Hash(map);

var lc = L.control.locate({
  follow: true,
  locateOptions: { enableHighAccuracy: true }
}).addTo(map);

map.on('dragstart', lc._stopFollowing, lc);

var MyControl = L.Control.extend({
  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
    var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
    link.href = '#';
    link.innerHTML = '<span class="fa fa-key"></span>';
    link.title = 'Show map key';

    L.DomEvent.on(link, 'click', L.DomEvent.stop)
      .on(link, 'click', function() {
        $('#key-modal').modal();
      });

    return container;
  }
});

map.addControl(new MyControl());
