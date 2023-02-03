function get(router, db) {
  router.get('/', (req, res) => res.send('Server API working'))
  router.get('*', function(req, res) {
    res.status(404).send('not found')
  })
}

module.exports = {
  get
}