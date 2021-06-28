import React from 'react';
import { convertToCoords, getKey, getDirections } from '../store/map';
import { connect } from 'react-redux';
import mapboxgl from '!mapbox-gl';
import findMiddle from './findMiddle';
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
      markers: [],
      directions: {
        directions1: {},
        directions2: {},
      },
    };
    this.mapContainer = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.setTravelType = this.setTravelType.bind(this);
  }

  handleChange(event) {
    console.log(`handle change: ${event.target.name}: ${event.target.value}`);
    // event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
    console.log('state in handle submit: ', this.state);
    event.preventDefault();
    await this.props.convertToCoords(this.state.address1, this.state.address2);
    const [midX, midY, marker1, marker2, midMarker] = await findMiddle(
      this.props.coordinates,
      this.state.map,
      this.state.address1,
      this.state.address2,
      this.state.travelType1.toLowerCase(),
      this.state.travelType2.toLowerCase(),
      this.state.markers
    );
    this.setState({
      ...this.state,
      midLng: midX,
      midLat: midY,
      markers: [marker1, marker2, midMarker],
    });
    console.log(
      'travel type 1 being sent from handle submit: ',
      this.state.travelType1
    );
    await this.props.getDirections(
      this.state.travelType1,
      this.props.coordinates[0],
      [midX, midY],
      1
    );
    await this.props.getDirections(
      this.state.travelType2,
      this.props.coordinates[1],
      [midX, midY],
      2
    );
    console.log(
      'Directions from address 1 to midpoint is: ',
      this.props.directions1.routes[0]
    );
    console.log(
      'Directions from address 2 to midpoint is: ',
      this.props.directions2.routes[0]
    );
    this.setState({
      ...this.state,
      directions: {
        directions1: this.props.directions1.routes[0],
        directions2: this.props.directions2.routes[0],
      },
    });
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
                <div className="travel-form" onChange={handleChange}>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="driving-travel"
                      name="travelType1"
                      value="Driving"
                      selected={this.state.travelType1 === 'Driving'}
                    />
                    <label>Driving</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="walking-travel"
                      name="travelType1"
                      value="Walking"
                      selected={this.state.travelType1 === 'Walking'}
                    />
                    <label>Walking</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="cycling-travel"
                      name="travelType1"
                      value="Cycling"
                      selected={this.state.travelType1 === 'Cycling'}
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
                <div className="travel-form" onChange={handleChange}>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="driving-travel"
                      name="travelType2"
                      value="Driving"
                      // onClick={() => handleChange}
                    />
                    <label>Driving</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="walking-travel"
                      name="travelType2"
                      value="Walking"
                      // onClick={() => handleChange}
                    />
                    <label>Walking</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="cycling-travel"
                      name="travelType2"
                      value="Cycling"
                      // onClick={() => handleChange}
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
            {this.state.directions.directions1.duration &&
            this.state.directions.directions2.duration ? (
              <div className="travel-time-results">
                <div className="travel-time">
                  Travel time from address 1 to meeting point is approximately{' '}
                  {Math.ceil(this.state.directions.directions1.duration / 60)}{' '}
                  minutes.
                </div>
                <div className="travel-time">
                  Travel time from address 2 to meeting point is approximately{' '}
                  {Math.ceil(this.state.directions.directions2.duration / 60)}{' '}
                  minutes
                </div>
              </div>
            ) : (
              <div></div>
            )}
            <button
              id="start-over-button"
              onClick={() => {
                this.state.markers.forEach((marker) => marker.remove());
                this.setState({
                  address1: '',
                  address2: '',
                  travelType1: 'Walking',
                  travelType2: 'Walking',
                  zoom: 12,
                  midLng: null,
                  midLat: null,
                  directions: {
                    directions1: {},
                    directions2: {},
                  },
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
    directions1: state.map.directions1,
    directions2: state.map.directions2,
  };
};

const mapDispatch = (dispatch) => {
  return {
    convertToCoords: (address1, address2) =>
      dispatch(convertToCoords(address1, address2)),
    getKey: () => dispatch(getKey()),
    getDirections: (travelType, address1, address2, routeNum) =>
      dispatch(getDirections(travelType, address1, address2, routeNum)),
  };
};

export default connect(mapState, mapDispatch)(MapBox);
