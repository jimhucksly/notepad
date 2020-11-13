import electronDebug from 'electron-debug'
import { app } from 'electron'

electronDebug()

app.on('ready', async () => {

})

require('./index')
