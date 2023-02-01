const { Server } = require('socket.io');

function createServer(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Authorization-Token']
    }
  });

  const isDev = process.env.NODE_ENV === 'development'
  const isProd = !isDev

  server.listen(8000, () => {
    console.log(`Server API is started on url: http://127.0.0.1:8000`)
  });

  io.on('connection', async (socket) => {
    socket.on('disconnect', async () => {
      //
    })
  })
}

module.exports = {
  createServer
}