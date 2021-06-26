import mapboxgl from '!mapbox-gl';

export default async function findMiddle(coordinates, map, address1, address2) {
  console.log('in find middle with coordinates: ', coordinates);
  console.log('local state map: ', map);
  const x1 = coordinates[0][0];
  const x2 = coordinates[1][0];
  const y1 = coordinates[0][1];
  const y2 = coordinates[1][1];
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const westmost = Math.min(x1, x2) - 0.005;
  const eastmost = Math.max(x1, x2) + 0.005;
  const southmost = Math.min(y1, y2) - 0.005;
  const northmost = Math.max(y1, y2) + 0.005;
  // this.setState({ ...this.state, midLng: midX, midLat: midY });
  await new mapboxgl.Marker()
    .setLngLat([midX, midY])
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<h3>' + 'Meeting Point' + '</h3>'
      )
    );
  await new mapboxgl.Marker()
    .setLngLat([x1, y1])
    .addTo(map)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        '<h3>' + 'Address 1' + '</h3><p>' + address1 + '</p'
      )
    );
  await new mapboxgl.Marker()
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
  return [midX, midY];
}
