import { Router, Request, Response, NextFunction } from 'express'
import { IApp } from '../model'
import {
  checkHeaders,
  checkSession,
  checkToken,
  getErrorCode
} from '../utils'

export function _delete(router: Router, $app: IApp) {
  router.delete('/project', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'notepad.json'
      const key = req.query.key as string
      const content = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      if (key in content) {
        delete content[key]
      }
      const payload = Buffer.from(JSON.stringify(content))
      await $app.yandex.uploadFile(filename, payload, user.yandex_disk_access_token)
      res.send({
        status: 'success',
        message: 'project is successfully removed'
      })
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.delete('/project/archive', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'archives'
      const info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
      if (info._embedded.items) {
        const found = info._embedded.items.find(item => item.resource_id === req.query.id)
        if (found) {
          await $app.yandex.deleteFile(path + '/' + encodeURI(found.name), user.yandex_disk_access_token)
          res.send({
            status: 'success',
            message: 'archive is successfully removed'
          })
        } else {
          throw new Error('resource not found')
        }
      } else {
        throw new Error('resource not found')
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.delete('/library', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'library'
      const info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
      if (info._embedded.items) {
        const found = info._embedded.items.find(item => item.resource_id === req.query.id)
        if (found) {
          await $app.yandex.deleteFile(path + '/' + encodeURI(found.name), user.yandex_disk_access_token)
          res.send({
            status: 'success',
            message: 'a library file is successfully removed'
          })
        } else {
          throw new Error('resource not found')
        }
      } else {
        throw new Error('resource not found')
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.delete('/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'events.json'
      const json = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      if (`${req.query.date}` in json) {
        delete json[req.query.date as string]
        const payload = Buffer.from(JSON.stringify(json))
        await $app.yandex.uploadFile(filename, payload, user.yandex_disk_access_token)
        res.send({
          status: 'success',
          message: 'event is successfully removed'
        })
      } else {
        throw new Error()
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.delete('/links', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'links.json'
      const json = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      const id = req.query.id
      if (`${id}` in json) {
        delete json[id as string]
        const payload = Buffer.from(JSON.stringify(json))
        await $app.yandex.uploadFile(filename, payload, user.yandex_disk_access_token)
        res.send({
          status: 'success',
          message: 'link is successfully removed'
        })
      } else {
        throw new Error()
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.delete('/todo', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const filename = 'todo.json'
      const json = await $app.yandex.downloadFile(filename, user.yandex_disk_access_token)
      const id = req.query.id
      if (`${id}` in json) {
        delete json[id as string]
        const payload = Buffer.from(JSON.stringify(json))
        await $app.yandex.uploadFile(filename, payload, user.yandex_disk_access_token)
        res.send({
          status: 'success',
          message: 'todo item is successfully removed'
        })
      } else {
        throw new Error()
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
  router.delete('/files', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkHeaders(req.headers)
      await checkSession(req.headers)
      const token = await checkToken(req.headers)
      const user = await $app.db.query().user({ token }).get()
      const path = 'files'
      const info = await $app.yandex.diskInfo(path, user.yandex_disk_access_token)
      if (info._embedded.items) {
        const found = info._embedded.items.find(item => item.resource_id === req.query.id)
        if (found) {
          await $app.yandex.deleteFile(path + '/' + encodeURI(found.name), user.yandex_disk_access_token)
          res.send({
            status: 'success',
            message: 'a file is successfully removed'
          })
        } else {
          throw new Error('resource not found')
        }
      } else {
        throw new Error('resource not found')
      }
    } catch (e) {
      res.status(getErrorCode(e?.message)).send({
        status: 'error',
        message: e?.message || 'bad request'
      })
    }
  })
}
