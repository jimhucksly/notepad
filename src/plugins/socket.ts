import { App } from 'vue'
import { io, Socket } from 'socket.io-client'
import { endpoint } from '../../config/endpoint.json'
import { ClientToServerEvents, ServerToClientEvents } from '~/domain/models/socket.io'
import { IRootState } from '~/domain/models'
import { Store } from 'vuex'

export default {
  install: (vue: App, { store }: { store: Store<IRootState> }) => {
    const isDev = process.env.NODE_ENV === 'development'
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(isDev ? '127.0.01:8000' : endpoint, {
      reconnection: false
    })

    const tryReconnect = () => {
      setTimeout(() => {
        socket.io.open((err) => {
          if (err) {
            store.commit('setError', true)
            tryReconnect()
          } else {
            store.commit('setError', false)
          }
        })
      }, 2000)
    }

    socket.io.on('close', tryReconnect)
    socket.io.on('error', tryReconnect)

    socket.on('connected', (id) => {
      store.commit('setSession', id)
    })

    vue.config.globalProperties.$socket = socket
  }
}
