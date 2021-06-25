const router = require('express').Router();
module.exports = router;

if (process.env.NODE_ENV !== 'production') {
  require('../../secrets');
}
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/apiKey', (req, res, next) => {
  try {
    res.json(GOOGLE_API_KEY);
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
