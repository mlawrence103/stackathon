import React from 'react';
import { compose, withProps } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import Geocode from 'react-geocode';
import { connect } from 'react-redux';
import { getKey } from '../store/map';

//why doesn't this work?
const GOOGLE_API_KEY = 'AIzaSyDA2x1eKy32zjTnoYOIipTxI2UrKZ_S';
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setLocationType('ROOFTOP');

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      address1: '',
      address2: '',
      center: {
        lat: 40.76,
        lng: -73.99,
      },
      zoom: 15,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.convertToLatLong = this.convertToLatLong.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    console.log('HERE in handle submit');
    event.preventDefault();
    const converted1 = this.convertToLatLong(this.state.address1);
    const converted2 = this.convertToLatLong(this.state.address2);
    console.log(`add1: ${this.state.address1} convert1: ${converted1}`);
    console.log(`add2: ${this.state.address2} convert2: ${converted2}`);
  }

  convertToLatLong(address) {
    Geocode.fromAddress(address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        return [(lat, lng)];
      },
      (error) => {
        console.error(error);
      }
    );
  }

  componentDidMount() {
    console.log('COMP DID MOUNT');
    this.props.getKey();
    this.setState({ ...this.state, key: this.props.map });
  }

  render() {
    // console.log('foundKey props in render: ', this.props.foundKey);
    // console.log('type of key: ', typeof this.props.foundKey);
    const { foundKey } = this.props;
    const { handleChange, handleSubmit } = this;

    const MyMap = compose(
      withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?${GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
      })(
        withScriptjs(
          withGoogleMap((props) => (
            <div>
              <GoogleMap
                defaultZoom={this.state.zoom}
                defaultCenter={this.state.center}
              >
                <Marker position={{ lat: 40.76, lng: -73.99 }} />
              </GoogleMap>
            </div>
          ))
        )
      )
    );

    return (
      <div>
        <div>
          <MyMap
            containerElement={
              <div
                style={{ height: `50vh`, width: '80%', margin: '0 10% 0 10%' }}
              />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
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

const mapState = (state) => {
  console.log('MAP STATE: ', state);
  let foundKey;
  if (state.map) {
    console.log('HERE');
    foundKey = state.map;
  }
  return {
    foundKey,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getKey: () => dispatch(getKey()),
  };
};

export default connect(mapState, mapDispatch)(Map);
