import fs from 'fs'
import path from 'path'
import { isJSON } from '~/helpers'

export default class Storage {
  static isPathExists(_path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        fs.statSync(_path)
        return resolve(true)
      } catch (e) {
        return reject(false)
      }
    })
  }

  static isFileExists(_path: string, _file?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let filePath = _path
      if (_file !== undefined) {
        filePath = path.resolve(_path, _file)
      }
      try {
        fs.statSync(filePath)
        return resolve(true)
      } catch (e) {
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
          } catch (e) {
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
        data = isJSON(json) ? JSON.stringify(json) : ''
      } catch (e) {
        data = ''
      }
      const fullPath = path.resolve(_path, fileName)
      const sResponse = await this.isFileExists(fullPath)
      if (!sResponse) {
        reject(null)
      }
      try {
        fs.writeFileSync(fullPath, data)
        resolve(void 0)
      } catch (err) {
        reject(err)
      }
    })
  }

  static get<T>(_path: string, _file: string, key?: string): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let fullPath = _path
      if (_file !== undefined) fullPath = path.resolve(_path, _file)
      try {
        const sResponse = await this.isFileExists(fullPath)
        if (!sResponse) {
          return reject(null)
        }
        const data = fs.readFileSync(fullPath, 'utf8')
        let json
        try {
          json = JSON.parse(data)
        } catch (e) {
          json = {}
        }
        if (key && json[key] !== undefined) {
          resolve(json[key])
        } else resolve(json)
      } catch (err) {
        return reject(null)
      }
    })
  }

  static createFile(_path: string, _file: string) {
    return new Promise(async (resolve, reject) => {
      let fullPath = _path
      if (_file !== undefined) fullPath = path.resolve(_path, _file)
      try {
        await this.isFileExists(fullPath)
        resolve(void 0)
      } catch (e) {
        fs.writeFile(fullPath, '{}', (err) => {
          if (err) {
            reject(new Error(`file ${fullPath} not found`))
          }
          resolve(void 0)
        })
      }
    })
  }
}
