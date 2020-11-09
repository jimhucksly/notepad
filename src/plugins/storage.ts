import fs from 'fs'
import path from 'path'

const debug = false

class Storage {
  public isPathExists(_path: string): Promise<any> {
    debug && console.log('isPathExists: call!')
    return new Promise((resolve, reject) => {
      debug && console.log('isPathExists: body of promise')
      try {
        fs.statSync(_path)
        debug && console.log('isPathExists: resolved!')
        return resolve()
      } catch(e) {
        debug && console.log('isPathExists: rejected!')
        return reject(e)
      }
    })
  }

  public isFileExists(_path: string, _file?: string): Promise<any> {
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
        return resolve({})
      } catch(e) {
        debug && console.log('isFileExists: rejected!')
        return reject(null)
      }
    })
  }

  public append(_path: string, fileName: string, json: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(_path, fileName)
      this.isFileExists(fullPath)
        .then(() => {
          let targetJson: any = fs.readFileSync(fullPath, 'utf8')
          try {
            targetJson = JSON.parse(targetJson)
          } catch(e) {
            targetJson = {}
          }
          const data = { ...targetJson, ...json }
          this.set(_path, fileName, data)
        })
        .catch(() => {
          this.set(_path, fileName, json)
        })
    })
  }

  public set(_path: string, fileName: string, json: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let data
      try {
        data = json ? JSON.stringify(json) : '{}'
      } catch(e) {
        data = '{}'
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
        resolve()
      } catch(err) {
        reject(err)
      }
    })
  }

  public get(_path: string, _file: string, key?: string): Promise<any> {
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

  public createFile(_path: string, _file: string) {
    debug && console.log('call storage.createFile')
    return new Promise(async (resolve, reject) => {
      let fullPath = _path
      if(_file !== undefined) fullPath = path.resolve(_path, _file)
      try {
        await this.isFileExists(fullPath)
        debug && console.log('file exists!!!!!')
        resolve()
      } catch(e) {
        fs.writeFile(fullPath, '{}', (err) => {
          if(err) {
            reject(new Error(`file ${fullPath} not found`))
          }
          debug && console.log('file created')
          resolve()
        })
      }
    })
  }
}

const instance = new Storage()
export default instance
