import fs from 'fs'
import path from 'path'
import { isJSON } from '~/helpers'

const debug = false

export default class Storage {
  static isPathExists(_path: string): Promise<boolean> {
    debug && console.log('isPathExists: call!')
    return new Promise((resolve, reject) => {
      debug && console.log('isPathExists: body of promise')
      try {
        fs.statSync(_path)
        debug && console.log('isPathExists: resolved!')
        return resolve(true)
      } catch(e) {
        debug && console.log('isPathExists: rejected!')
        return reject(false)
      }
    })
  }

  static isFileExists(_path: string, _file?: string): Promise<boolean> {
    debug && console.log('call isFileExists')
    debug && console.log('_path: ', _path)
    debug && console.log('_file: ', _file)
    return new Promise((resolve, reject) => {
      let filePath = _path
      if(_file !== undefined) {
        filePath = path.resolve(_path, _file)
      }
      debug && console.log('call fs.stat')
      try {
        fs.statSync(filePath)
        debug && console.log('fs.stat callback exec!!!!!')
        debug && console.log('isFileExists: resolved!')
        return resolve(true)
      } catch(e) {
        debug && console.log('isFileExists: rejected!')
        return reject(false)
      }
    })
  }

  static append<T>(_path: string, fileName: string, json: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(_path, fileName)
      this.isFileExists(fullPath)
        .then(() => {
          const oldVal: string = fs.readFileSync(fullPath, 'utf8')
          let oldJson: T | Record<string, unknown>
          try {
            oldJson = JSON.parse(oldVal)
          } catch(e) {
            oldJson = {}
          }
          const data = { ...oldJson, ...json }
          this.set(_path, fileName, data)
        })
        .catch(() => {
          this.set<T>(_path, fileName, json)
        })
    })
  }

  static set<T>(_path: string, fileName: string, json: T): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let data
      try {
        debug && console.log('data for set:')
        debug && console.log(json)
        debug && console.log('isJson data')
        debug && console.log(isJSON(json))
        data = isJSON(json) ? JSON.stringify(json) : ''
      } catch(e) {
        data = ''
      }
      const fullPath = path.resolve(_path, fileName)
      debug && console.log('call isFileExists')
      const sResponse = await this.isFileExists(fullPath)
      debug && console.log('after isFileExists')
      if(!sResponse) {
        reject(null)
      }
      try {
        fs.writeFileSync(fullPath, data)
        resolve(void 0)
      } catch(err) {
        reject(err)
      }
    })
  }

  static get<T>(_path: string, _file: string, key?: string): Promise<T> {
    debug && console.log('call storage.get')
    return new Promise(async (resolve, reject) => {
      let fullPath = _path
      if(_file !== undefined) fullPath = path.resolve(_path, _file)
      try {
        debug && console.log('call storage.isFileExists')
        const sResponse = await this.isFileExists(fullPath)
        if(!sResponse) {
          console.log('storage.isFileExists failed!')
          return reject(null)
        }
        const data = fs.readFileSync(fullPath, 'utf8')
        let json
        try {
          json = JSON.parse(data)
        } catch(e) {
          json = {}
        }
        if(key && json[key] !== undefined) {
          resolve(json[key])
        } else resolve(json)
      } catch(err) {
        return reject(null)
      }
    })
  }

  static createFile(_path: string, _file: string) {
    debug && console.log('call storage.createFile')
    return new Promise(async (resolve, reject) => {
      let fullPath = _path
      if(_file !== undefined) fullPath = path.resolve(_path, _file)
      try {
        await this.isFileExists(fullPath)
        debug && console.log('file exists!!!!!')
        resolve(void 0)
      } catch(e) {
        fs.writeFile(fullPath, '{}', (err) => {
          if(err) {
            reject(new Error(`file ${fullPath} not found`))
          }
          debug && console.log('file created')
          resolve(void 0)
        })
      }
    })
  }
}
