// Map

var map = L.map('map', {
  center: [-33.5, 19.5],
  zoom: 8,
  minZoom: 4,
  maxZoom: 15,
  //maxBounds: [[-34.85, 16.25], [-22, 33]]
});

// Layers

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

// Controls

L.control.layers({
  "1:50 000 topo": fiftyk
}, {
  "OpenStreetMap": osm,
  "Graticule": graticule
}).addTo(map);

var hash = new L.Hash(map);

var lc = L.control.locate({
  follow: true,
  locateOptions: { enableHighAccuracy: true }
}).addTo(map);

map.on('dragstart', lc._stopFollowing, lc);
