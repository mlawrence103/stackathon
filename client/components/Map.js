import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon } from '@iconify/react';
import { connect } from 'react-redux';
import { getKey } from '../store/map';
import locationIcon from '@iconify/icons-mdi/map-marker';

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
);

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address1: '',
      address2: '',
      center: {
        lat: 40.76364021115866,
        lng: -73.99213530135947,
      },
      zoom: 15,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {}

  componentDidMount() {
    console.log('COMP DID MOUNT');
    this.props.getKey();
    // this.setState({ ...this.state, key: this.props.map });
  }

  render() {
    console.log('foundKey props in render: ', this.props.foundKey);
    console.log('type of key: ', typeof this.props.foundKey);
    const { foundKey } = this.props;
    const { handleChange, handleSubmit } = this.state;
    return (
      <div>
        <div style={{ height: '50vh', width: '75%' }} className="map">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: 'AIzaSyBmmRS1d-LfH5LVCbpJ4s6Dh3aPS8EKT7E',
            }}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
          >
            <LocationPin lat={40.76} lng={-73.99} text="My Marker" />
          </GoogleMapReact>
        </div>
        <form id="address-form">
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
