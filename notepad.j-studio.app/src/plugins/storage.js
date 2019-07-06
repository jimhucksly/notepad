import fs from 'fs'
import path from 'path'

const Storage = (function() {
  function storage() {
    this.isPathExists = (_path) => {
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

    this.isFileExists = (_path, _file) => {
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

    this.append = (_path, fileName, json) => {
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

    this.set = (_path, fileName, json) => {
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
        fs.writeFileSync(fullPath, data, (err) => {
          if(err) return reject(err)
          return resolve()
        })
      })
    }

    this.get = (_path, _file, key) => {
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
          .catch((err) => {
            reject(err)
          })
      })
    }
  }
  return storage
})()

export default new Storage()
