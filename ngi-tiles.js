var map = L.map('map', {
  //center: [-28.5, 24.5],
  //zoom: 6,
  minZoom: 4,
  maxZoom: 15,
  //maxBounds: [[-34.85, 16.25], [-22, 33]]
});
map.fitBounds([[-34.85, 16.25], [-22, 33]]);

var fiftyk = L.tileLayer('tiles/{z}/{x}/{y}.png', {
  tms: true,
  attribution: 'State Copyright &copy; 1996&ndash;2013 <a href="http://www.ngi.gov.za/">Chief Directorate: National Geo-spatial Information</a>'
}).addTo(map);

var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Copyright &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  opacity: 0.5
});

var graticule = L.layerGroup([
  L.graticule({interval: 0.25}),
  L.graticule({interval: 1, style: { weight: 2 }})
]);

var layerControl = L.control.layers({
  "1:50 000 topo": fiftyk
}, {
  "OpenStreetMap": osm,
  "Graticule": graticule
}).addTo(map);

$.getJSON('sheet50k.json', function (data) {
  var sheets = L.geoJson(data, {
    style: {
      stroke: true, color: 'black', weight: 1, opacity: 1,
      fill: true, fillColor: 'lightblue', fillOpacity: 0
    },
    onEachFeature: function (feature, layer) {
      var props = feature.properties;
      layer.bindPopup('Sheet ' + props.s + '<br/>Ed. ' + props.e + ' (' + props.y + ')');

      layer.on('mouseover', function () {
        this.setStyle({ fillOpacity: 0.5 });
      });
      layer.on('mouseout', function () {
        this.setStyle({ fillOpacity: 0 });
      });
    }
  });

  layerControl.addOverlay(sheets, "Sheet info");
});

var hash = new L.Hash(map);

var lc = L.control.locate({
  follow: true,
  locateOptions: { enableHighAccuracy: true }
}).addTo(map);

map.on('dragstart', lc._stopFollowing, lc);
