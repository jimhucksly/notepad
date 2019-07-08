import * as fs from 'fs'
import * as path from 'path'

interface iStorage {
  isPathExists(_path: string): Promise<void>;
  isFileExists(_path: string, _file: string): Promise<void>;
  append(_path: string, fileName: string, json: object): Promise<void>;
  set(_path:string, fileName:string, json: object): Promise<void>;
  get(_path: string, _file: string, key: string): Promise<void>;
}

class Storage<iStorage>  {
  isPathExists(_path: string) {
    return new Promise((resolve, reject) => {
      fs.access(_path, (err) => {
        if(err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  }

  isFileExists(_path: string, _file?: string) {
    return new Promise((resolve, reject) => {
      let filePath = _path
      if(_file !== undefined) filePath = path.resolve(_path, _file)
      fs.access(filePath, (err) => {
        if(err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  }

  append(_path: string, fileName: string, json: object) {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(_path, fileName)
      this.isFileExists(fullPath)
        .then(() => {
          let targetJson = fs.readFileSync(fullPath, 'utf8')
          try {
            targetJson = JSON.parse(targetJson)
          } catch (err) {
            return reject(err)
          }
          let data = Object.assign({}, targetJson, json)
          this.set(_path, fileName, data)
        })
        .catch(() => {
          this.set(_path, fileName, json)
        })
    })
  }

  set(_path: string, fileName: string, json: object){
    return new Promise((resolve, reject) => {
      let data
      try {
        if(json) {
          data = JSON.stringify(json)
        } else {
          data = null
        }
      } catch (err) {
        return reject(err)
      }
      const fullPath = path.resolve(_path, fileName)
      try {
        fs.writeFileSync(fullPath, data)
        resolve()
      } catch(err) {
        reject(err)
      }
    })
  }

  get(_path: string, _file: string, key: string){
    return new Promise((resolve, reject) => {
      let fullPath = _path
      if(_file !== undefined) fullPath = path.resolve(_path, _file)
      this.isFileExists(fullPath)
        .then(() => {
          const data = fs.readFileSync(fullPath, 'utf8')
          let json
          try {
            json = JSON.parse(data)
          } catch (err) {
            return reject(err)
          }
          if(json[key] !== undefined) resolve(json[key])
          else resolve(json)
        })
        .catch((err:any) => {
          reject(err)
        })
    })
  }
}

export default new Storage()
