import React from 'react';
import { convertToCoords, getKey } from '../store/map';
import { connect } from 'react-redux';
import mapboxgl from '!mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

class MapBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address1: '',
      address2: '',
      travelType1: 'Walking',
      travelType2: 'Walking',
      lng: -73.99,
      lat: 40.76,
      zoom: 12,
      midLng: null,
      midLat: null,
      map: null,
    };
    this.mapContainer = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findMiddle = this.findMiddle.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    await this.props.convertToCoords(this.state.address1, this.state.address2);
    this.findMiddle(this.props.coordinates);
  }

  async findMiddle(coordinates) {
    console.log('in find middle with coordinates: ', coordinates);
    console.log('local state map: ', this.state.map);
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
    // console.log(`middle (${midX},${midY})`);
    this.setState({ ...this.state, midLng: midX, midLat: midY });
    await new mapboxgl.Marker()
      .setLngLat([midX, midY])
      .addTo(this.state.map)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<h3>' + 'Meeting Point' + '</h3>'
        )
      );
    await new mapboxgl.Marker()
      .setLngLat([x1, y1])
      .addTo(this.state.map)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<h3>' + 'Address 1' + '</h3><p>' + this.state.address1 + '</p'
        )
      );
    await new mapboxgl.Marker()
      .setLngLat([x2, y2])
      .addTo(this.state.map)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          '<h3>' + 'Address2' + '</h3><p>' + this.state.address2 + '</p'
        )
      );
    this.state.map.fitBounds([
      [westmost, southmost],
      [eastmost, northmost],
    ]);
  }

  async componentDidMount() {
    const key = await this.props.getKey();
    console.log('key: ', key.key);
    mapboxgl.accessToken = key.key;
    console.log('props in comp did mount: ', this.props);
    const { lng, lat, zoom } = this.state;

    const map = await new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    // const directions = new MapboxDirections({
    //   accessToken: mapboxgl.accessToken,
    //   unit: 'metric',
    //   profile: 'mapbox/walking',
    // });
    // map.addControl(directions, 'top-left');

    this.setState({ map: map });
  }

  render() {
    console.log('in render');
    const { handleChange, handleSubmit } = this;
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
        <form id="address-form">
          <div id="address-form-info">
            <section id="address-1-section">
              <div className="address-input">
                <label htmlFor="address-1">
                  <small>Address 1:</small>
                </label>
                <input
                  name="address1"
                  type="text"
                  onChange={handleChange}
                  value={this.state.address1}
                />
              </div>
              <div className="travel-form-wrapper">
                <small>Travel Type: </small>
                <div className="travel-form">
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="driving-travel"
                      name="travelType1"
                      value="Driving"
                      onClick={this.setState({ travelType1: 'Driving' })}
                    />
                    <label>Driving</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="walking-travel"
                      name="travelType1"
                      value="Walking"
                      onClick={this.setState({ travelType1: 'Walking' })}
                    />
                    <label>Walking</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="cycling-travel"
                      name="travelType1"
                      value="Cycling"
                      onClick={this.setState({ travelType1: 'Cycling' })}
                    />
                    <label>Cycling</label>
                  </div>
                </div>
              </div>
            </section>
            <section id="address-2-section">
              <div className="address-input">
                <label htmlFor="address-2">
                  <small>Address 2:</small>
                </label>
                <input
                  name="address2"
                  type="text"
                  onChange={handleChange}
                  value={this.state.address2}
                />
              </div>
              <div className="travel-form-wrapper">
                <small>Travel Type: </small>
                <div className="travel-form">
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="driving-travel"
                      name="travelType2"
                      value="Driving"
                      onClick={this.setState({ travelType1: 'Driving' })}
                    />
                    <label>Driving</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="walking-travel"
                      name="travelType2"
                      value="Walking"
                      onClick={this.setState({ travelType1: 'Walking' })}
                    />
                    <label>Walking</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="cycling-travel"
                      name="travelType2"
                      value="Cycling"
                      onClick={this.setState({ travelType1: 'Cycling' })}
                    />
                    <label>Cycling</label>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <button id="find-spot-button" type="submit" onClick={handleSubmit}>
            Find a Meeting Spot
          </button>
        </form>
        {this.state.midLng ? (
          <div className="midpoint-results">
            <div id="middle-coords">
              Your midway meeting spot is at: {this.state.midLng}˚,{' '}
              {this.state.midLat}˚
            </div>
            <button
              id="start-over-button"
              onClick={() => {
                this.setState({
                  address1: '',
                  address2: '',
                  midLng: '',
                  midLat: '',
                });
              }}
            >
              Start Over
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    key: state.map.key,
    coordinates: state.map.coordinates,
  };
};

const mapDispatch = (dispatch) => {
  return {
    convertToCoords: (address1, address2) =>
      dispatch(convertToCoords(address1, address2)),
    getKey: () => dispatch(getKey()),
  };
};

export default connect(mapState, mapDispatch)(MapBox);
