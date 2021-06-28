import axios from 'axios';

const FIND_FOOD = 'FIND_FOOD';
const FIND_EVENTS = 'FIND_EVENTS';

const _findFood = (results) => {
  return {
    type: FIND_FOOD,
    results,
  };
};

const _findEvents = (results) => {
  return {
    type: FIND_EVENTS,
    results,
  };
};

export const findFood = (long, lat) => {
  return async (dispatch) => {
    try {
      console.log('IN FIND FOOD with coords: ', lat, long);
      const keyRes = await axios.get('/api/yelpApiKey');
      const key = keyRes.data;
      const results = await axios.get(
        `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${long}&categories=restaurants&limit=10&sort_by=rating&radius=402`,
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        }
      );
      console.log('results from find food thunk: ', results.data.businesses);
      return dispatch(_findFood(results.data.businesses));
    } catch (error) {
      console.log("Couldn't find lunch spots", error);
    }
  };
};

export const findEvents = (long, lat) => {
  return async (dispatch) => {
    try {
      console.log('IN FIND EVENTS thunk with coords: ', lat, long);
      const keyRes = await axios.get('/api/yelpApiKey');
      const key = keyRes.data;
      const results = await axios.get(
        `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/events/search?latitude=${lat}&longitude=${long}&categories=sightseeing,culture,arts&sort_by=rating&radius=800`,
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        }
      );
      console.log('results from find food thunk: ', results.data.businesses);
      return dispatch(_findEvents(results.data.businesses));
    } catch (error) {
      console.log("Couldn't find lunch spots", error);
    }
  };
};

export default function (state = { food: [], events: [] }, action) {
  switch (action.type) {
    case FIND_FOOD:
      return { ...state, food: action.results };
    case FIND_EVENTS:
      return { ...state, events: action.results };
    default:
      return state;
  }
}
