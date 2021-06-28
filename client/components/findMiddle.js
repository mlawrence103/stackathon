import mapboxgl from '!mapbox-gl';

export default async function findMiddle(
  coordinates,
  map,
  address1,
  address2,
  travelType1,
  travelType2,
  markers
) {
  console.log('in find middle with markers: ', markers);
  // console.log('local state map: ', map);

  //rename coordinates for something more usable
  const x1 = coordinates[0][0];
  const x2 = coordinates[1][0];
  const y1 = coordinates[0][1];
  const y2 = coordinates[1][1];

  //find weighted meeting spot
  //assue walking at 3mph, driving (in the city) at 24 mph, and biking in the city at 18mph
  //walking - driving pair should be 8 times closer to walking start
  //walking - biking pair should be 6 times closer to walking start
  //biking - driving pair should be 4/3 times closer to the biking start
  //use formula: (x,y) = (x1 + k(x2-x1), y1 +k(y2-y1)) where k is fractional part of segment we want
  let k = 1;
  if (travelType1 === travelType2) {
    k = 1 / 2;
  } else if (travelType1 === 'walking' && travelType2 === 'driving') {
    k = 1 / 8;
  } else if (travelType1 === 'walking' && travelType2 === 'cycling') {
    k = 1 / 6;
  } else if (travelType1 === 'cycling' && travelType2 === 'driving') {
    k = 1 / 4;
  } else if (travelType1 === 'driving' && travelType2 === 'walking') {
    k = 7 / 8;
  } else if (travelType1 === 'cycling' && travelType2 === 'walking') {
    k = 5 / 6;
  } else if (travelType1 === 'driving' && travelType2 === 'cycling') {
    k = 3 / 4;
  }

  const midX = x1 + k * (x2 - x1);
  const midY = y1 + k * (y2 - y1);

  const westmost = Math.min(x1, x2) - 0.005;
  const eastmost = Math.max(x1, x2) + 0.005;
  const southmost = Math.min(y1, y2) - 0.005;
  const northmost = Math.max(y1, y2) + 0.005;

  //if the map already has markers on it, remove them
  if (markers.length) {
    markers.forEach((marker) => marker.remove());
  }

  const midMarker = await new mapboxgl.Marker()
    .setLngLat([midX, midY])
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<h3>' + 'Meeting Point' + '</h3>'
      )
    );
  const marker1 = await new mapboxgl.Marker()
    .setLngLat([x1, y1])
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<h3>' + 'Address 1' + '</h3><p>' + address1 + '</p'
      )
    );
  const marker2 = await new mapboxgl.Marker()
    .setLngLat([x2, y2])
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<h3>' + 'Address2' + '</h3><p>' + address2 + '</p'
      )
    );
  map.fitBounds([
    [westmost, southmost],
    [eastmost, northmost],
  ]);
  return [midX, midY, marker1, marker2, midMarker];
}
