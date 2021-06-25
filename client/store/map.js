import axios from 'axios';
const GET_MAPBOX_API_KEY = 'GET_GOOGLE_API_KEY';
const CONVERT_TO_COORDS = 'CONVERT_TO_COORDS';

const gotKey = (key) => {
  console.log('key from server in ACTION: ', key);
  return { type: GET_MAPBOX_API_KEY, key };
};

const _convertToCoords = (coordinates) => {
  return {
    type: CONVERT_TO_COORDS,
    coordinates,
  };
};

export const getKey = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get('/api/apiKey');
      return dispatch(gotKey(res.data));
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
      const apiKeyRes = await axios.get('/api/apiKey');
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

export default function (state = { key: '', coords: [] }, action) {
  switch (action.type) {
    case GET_MAPBOX_API_KEY:
      return { ...state, key: action.key };
    case CONVERT_TO_COORDS:
      return { ...state, coordinates: action.coordinates };
    default:
      return state;
  }
}
