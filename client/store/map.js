import axios from 'axios';
const GET_GOOGLE_API_KEY = 'GET_GOOGLE_API_KEY';

const gotKey = (key) => {
  console.log('key from server in ACTION: ', key);
  return { type: GET_GOOGLE_API_KEY, key };
};

export const getKey = () => {
  return async (dispatch) => {
    console.log('in get key thunk');
    try {
      const res = await axios.get('/api/apiKey');
      return dispatch(gotKey(res.data));
    } catch (error) {
      console.log("couldn't get api key", error);
    }
  };
};

export default function (state = '', action) {
  switch (action.type) {
    case GET_GOOGLE_API_KEY:
      return action.key;
    default:
      return state;
  }
}
