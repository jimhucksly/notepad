import fs from 'fs';
import path from 'path';
import { isDefined, isJSON } from '~/helpers';

export default class Storage {
  static isPathExists(_path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        fs.statSync(_path);
        return resolve(true);
      } catch (e) {
        return reject(new Error());
      }
    });
  }

  static isFileExists(_path: string, _file?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let filePath = _path;
      if (_file !== undefined) {
        filePath = path.resolve(_path, _file);
      }
      try {
        fs.statSync(filePath);
        return resolve(true);
      } catch (e) {
        return reject(new Error());
      }
    });
  }

  static append<T>(_path: string, fileName: string, json: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(_path, fileName);
      this.isFileExists(fullPath)
        .then(() => {
          const oldVal: string = fs.readFileSync(fullPath, 'utf8');
          let oldJson: T | Record<string, unknown>;
          try {
            oldJson = JSON.parse(oldVal);
          } catch (e) {
            oldJson = {};
          }
          const data = { ...oldJson, ...json };
          this.set(_path, fileName, data);
        })
        .catch(() => {
          this.set<T>(_path, fileName, json);
        });
    });
  }

  static async set<T>(_path: string, fileName: string, json: T): Promise<void> {
    try {
      let data;
      try {
        data = isJSON(json) ? JSON.stringify(json) : '';
      } catch (e) {
        data = '';
      }
      const fullPath = path.resolve(_path, fileName);
      const sResponse = await this.isFileExists(fullPath);
      if (!sResponse) {
        throw new Error();
      }
      fs.writeFileSync(fullPath, data);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async get<T>(_path: string, _file: string, key?: string): Promise<T> {
    try {
      let fullPath = _path;
      if (_file !== undefined) {
        fullPath = path.resolve(_path, _file);
      }
      const sResponse = await this.isFileExists(fullPath);
      if (!sResponse) {
        throw new Error();
      }
      const data = fs.readFileSync(fullPath, 'utf8');
      let json;
      try {
        json = JSON.parse(data);
      } catch (e) {
        json = {};
      }
      if (!key) {
        return json;
      }
      if (key && key in json) {
        return isDefined(json[key]) ? json[key] : json;
      }
      if (key && !(key in json)) {
        throw new Error();
      }
      return json;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static async createFile(_path: string, _file: string): Promise<void> {
    try {
      let fullPath = _path;
      if (_file !== undefined) {
        fullPath = path.resolve(_path, _file);
      }
      try {
        await this.isFileExists(fullPath);
      } catch (e) {
        fs.writeFile(fullPath, '{}', err => {
          if (err) {
            throw new Error(`file ${fullPath} not found`);
          }
        });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
