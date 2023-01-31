const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('Server API working'));

router.post('/auth', (req, res, next) => {
  res.send('hello')
})

router.get('*', function(req, res){
  res.status(404).send('not found');
})


module.exports = router;