import axios from 'axios';
const GET_MAPBOX_API_KEY = 'GET_GOOGLE_API_KEY';
const CONVERT_TO_COORDS = 'CONVERT_TO_COORDS';
const GET_DIRECTIONS1 = 'GET_DIRECTIONS1';
const GET_DIRECTIONS2 = 'GET_DIRECTIONS2';

const gotMapKey = (key) => {
  console.log('key from server in ACTION: ', key);
  return { type: GET_MAPBOX_API_KEY, key };
};

const _convertToCoords = (coordinates) => {
  return {
    type: CONVERT_TO_COORDS,
    coordinates,
  };
};

const _getDirections1 = (directions) => {
  return {
    type: GET_DIRECTIONS1,
    directions,
  };
};

const _getDirections2 = (directions) => {
  return {
    type: GET_DIRECTIONS2,
    directions,
  };
};

export const getMapKey = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get('/api/mapApiKey');
      return dispatch(gotMapKey(res.data));
    } catch (error) {
      console.log("couldn't get api key", error);
    }
  };
};

export const convertToCoords = (address1, address2) => {
  console.log('in convert thunk with addresses: ', address1, address2);
  const encodedAddress1 = encodeURI(address1);
  const encodedAddress2 = encodeURI(address2);
  console.log('encoded address: ', encodedAddress1, encodedAddress2);
  return async (dispatch) => {
    try {
      const apiKeyRes = await axios.get('/api/mapApiKey');
      const apiKey = apiKeyRes.data;
      const res1 = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress1}.json?access_token=${apiKey}`
      );
      const convertedAddress1 = res1.data.features[0].center;
      const res2 = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress2}.json?access_token=${apiKey}`
      );
      const convertedAddress2 = res2.data.features[0].center;
      console.log(
        'response from geocoder: ',
        res1.data.features,
        res2.data.features
      );
      console.log('converted address: ', convertedAddress1, convertedAddress2);
      return dispatch(_convertToCoords([convertedAddress1, convertedAddress2]));
    } catch (error) {
      console.log('error converting to coodinates', error);
    }
  };
};

//addresses should be passed in as coordinates
//route num determines which part of state should be set
export const getDirections = (travelType, address1, address2, routeNum) => {
  console.log('HERE in get directions thunk');
  console.log('inputs: ', travelType, address1, address2);
  return async (dispatch) => {
    try {
      const apiKeyRes = await axios.get('/api/mapApiKey');
      const apiKey = apiKeyRes.data;
      const directionsRes = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/${travelType.toLowerCase()}/${
          address1[0]
        },${address1[1]};${address2[0]},${address2[1]}?access_token=${apiKey}`
      );
      const directions = directionsRes.data;
      console.log('response from directions api: ', directions);
      if (routeNum === 1) {
        return dispatch(_getDirections1(directions));
      } else {
        return dispatch(_getDirections2(directions));
      }
    } catch (error) {
      console.log("Couldn't get directions", error);
    }
  };
};

export default function (
  state = { key: '', coords: [], directions: {} },
  action
) {
  switch (action.type) {
    case GET_MAPBOX_API_KEY:
      return { ...state, key: action.key };
    case CONVERT_TO_COORDS:
      return { ...state, coordinates: action.coordinates };
    case GET_DIRECTIONS1:
      return { ...state, directions1: action.directions };
    case GET_DIRECTIONS2:
      return { ...state, directions2: action.directions };
    default:
      return state;
  }
}
