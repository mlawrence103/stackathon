import React from 'react';
import { convertToCoords, getMapKey, getDirections } from '../store/map';
import { findFood, findEvents } from '../store/yelp';
import { connect } from 'react-redux';
import mapboxgl from '!mapbox-gl';
import findMiddle from './findMiddle';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

//all coordinates are in form longitude, latitude, but they are rendered (lat,long)

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
      food: [],
      events: [],
      directions: {
        directions1: {},
        directions2: {},
      },
    };
    this.mapContainer = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.findFood = this.findFood.bind(this);
    this.findEvents = this.findEvents.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  async handleSubmit(event) {
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
    this.setState({
      ...this.state,
      directions: {
        directions1: this.props.directions1.routes[0],
        directions2: this.props.directions2.routes[0],
      },
    });
  }

  async findFood() {
    if (!this.state.food.length) {
      const results = await this.props.findFood(
        this.state.midLng,
        this.state.midLat
      );
      this.setState({ ...this.state, food: results.results });
    }
  }

  async findEvents() {
    if (!this.state.events.length) {
      const results = await this.props.findEvents(
        this.state.midLng,
        this.state.midLat
      );
      this.setState({ ...this.state, events: results.results });
    }
  }

  async componentDidMount() {
    const key = await this.props.getMapKey();
    mapboxgl.accessToken = key.key;
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
                    />
                    <label>Driving</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="walking-travel"
                      name="travelType2"
                      value="Walking"
                    />
                    <label>Walking</label>
                  </div>
                  <div className="travel-type">
                    <input
                      type="radio"
                      className="cycling-travel"
                      name="travelType2"
                      value="Cycling"
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
              Your midway meeting spot is at: {this.state.midLat}˚,{' '}
              {this.state.midLng}˚
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
            <div id="yelp-buttons">
              <button
                id="find-food-button"
                onClick={() => {
                  this.findFood();
                }}
              >
                Find Food Near Meetup
              </button>
              <button
                id="find-events"
                onClick={() => {
                  this.findEvents();
                }}
              >
                Find Events Near Meetup
              </button>
            </div>
            {this.state.food.length ? (
              <div className="yelp-results">
                {this.state.food.map((result) => (
                  <div className="restaurant" key={result.id}>
                    <div className="restaurant-name">{result.name}</div>
                    <div className="restaurant-address">
                      {result.location.address1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div></div>
            )}
            {this.state.events.length ? (
              <div className="yelp-results">
                {this.state.events.map((result) => (
                  <div className="event" key={result.id}>
                    <div className="event-name">{result.name}</div>
                    <div className="event-category">
                      Category: {result.categories[0].title}
                    </div>
                    <div className="event-address">
                      {result.location.address1}
                    </div>
                  </div>
                ))}
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
                  food: [],
                  events: [],
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
    food: state.yelp.food,
    events: state.yelp.events,
  };
};

const mapDispatch = (dispatch) => {
  return {
    convertToCoords: (address1, address2) =>
      dispatch(convertToCoords(address1, address2)),
    getMapKey: () => dispatch(getMapKey()),
    getDirections: (travelType, address1, address2, routeNum) =>
      dispatch(getDirections(travelType, address1, address2, routeNum)),
    findFood: (long, lat) => dispatch(findFood(long, lat)),
    findEvents: (long, lat) => dispatch(findEvents(long, lat)),
  };
};

export default connect(mapState, mapDispatch)(MapBox);
