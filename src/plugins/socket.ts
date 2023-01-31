import { App } from 'vue'
import { io, Socket } from 'socket.io-client'
import { endpoint } from '../../config/endpoint.json'
import { ClientToServerEvents, ServerToClientEvents } from '~/domain/models/socket.io'

export default {
  install: (vue: App) => {
    const isDev = process.env.NODE_ENV === 'development'
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(isDev ? '127.0.01:8000' : endpoint)
    vue.config.globalProperties.$socket = socket
  }
}
