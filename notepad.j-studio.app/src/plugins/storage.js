import fs from 'fs'
import path from 'path'

const storage = {
  isPathExists: (_path) => {
    return new Promise((resolve, reject) => {
      fs.access(_path, (err) => {
        if(err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  },
  isFileExists: (_path, _file) => {
    return new Promise((resolve, reject) => {
      const filePath = path.resolve(_path, _file)
      fs.access(filePath, (err) => {
        if(err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })
  },
  set: (_path, fileName, json) => {
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
      fs.writeFile(fullPath, data, (err) => {
        if(err) return reject(err)
        return resolve()
      })
    })
  },
  get: (_path, _file, key) => {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(_path, _file)
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
  }
}

export default storage
