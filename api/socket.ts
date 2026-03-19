import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { IApp } from './model';

function createServer(server: HTTPServer, $app: IApp) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'SSID'],
    },
  });

  server.listen(8000, () => {
    /* eslint-disable no-console */
    console.log('Server API is started on url: http://127.0.0.1:8000');
  });

  io.on('connection', socket => {
    socket.emit('connected', socket.id);

    socket.on('disconnect', () => {
      $app.db.command().session(socket.id).revoke();
    });
  });
}

export { createServer };
