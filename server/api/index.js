const router = require('express').Router();
module.exports = router;

if (process.env.NODE_ENV !== 'production') {
  require('../../secrets');
}
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;

router.get('/mapApiKey', (req, res, next) => {
  try {
    res.json(MAPBOX_API_KEY);
  } catch (error) {
    next(error);
  }
});

router.get('/yelpApiKey', (req, res, next) => {
  try {
    res.json(YELP_API_KEY);
  } catch (error) {
    next(error);
  }
});

router.use('/users', require('./users'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
