import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFiZWwxMDMiLCJhIjoiY2txY2k1dXhxMTZ5ajJ1bGN1cm5sejVxeiJ9.exko0Umm8H22tn7KDT7nbw';

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address1: '',
      address2: '',
      lng: -73.99,
      lat: 40.76,
      zoom: 12,
    };
    this.mapContainer = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
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

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking',
    });
    map.addControl(directions, 'top-left');
  }

  render() {
    const { handleChange, handleSubmit } = this;
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
        <form id="address-form">
          <div id="address-form-info">
            <div className="address-input">
              <label htmlFor="address-1">
                <small>Address 1:</small>
              </label>
              <input name="address1" type="text" onChange={handleChange} />
            </div>
            <div className="address-input">
              <label htmlFor="address-2">
                <small>Address 2:</small>
              </label>
              <input name="address2" type="text" onChange={handleChange} />
            </div>
          </div>
          <button type="submit" onClick={handleSubmit}>
            Find a Meeting Spot
          </button>
        </form>
      </div>
    );
  }
}
