import { cloneDeep } from 'lodash'
import $http from '~/store/http'
import {
  IRootState,
  ICheckResponse,
  IResponse
} from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Queryable } from '~/domain/queries/query.bus'
import { Commandable } from '~/domain/commands/command.bus'
import {
  AuthQuery,
  RefreshYandexTokenQuery,
  SessionQuery,
  YandexDiskInfoQuery,
  YandexDiskResourceLinkQuery,
  YandexTokenQuery
} from '~/domain/queries'
import {
  AuthCommand,
  ReadCommand,
  RevokeYandexTokenCommand
} from '~/domain/commands'
import { ActionTree, ActionContext } from 'vuex'
import { Hub } from '~/plugins/hub'
import { toActionTree } from '~/helpers'

type TStore = ActionContext<IRootState, IRootState>

class Actions implements ActionTree<IRootState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  @Commandable(TYPES.AuthCommand)
  auth(store: TStore, command: AuthCommand) {
    store.commit('setIsAuth', command.flag)
  }

  @Commandable(TYPES.ReadCommand)
  read(store: TStore, command: ReadCommand): void {
    const json = cloneDeep(store.getters['getJson'])
    delete json[command.stamp]['unread']
    store.commit('projects/setJson', json)
  }

  /**
   * Auth
   * @param store Store
   * @param {AuthQuery} data
   */
  @Queryable(TYPES.AuthQuery)
  async actionAuth(store: TStore, query: AuthQuery): Promise<IResponse<void>> {
    try {
      setProcess(store, 'authentication...')
      const resp = await $http.post<{ login: string, password: string }, void>('/auth', {
        login: query.login,
        password: query.password
      })
      if(resp.token) {
        return resp
      }
      return Promise.reject(resp)
    } catch(e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Session
   * @param store Store
   * @param {SessionQuery} data
   */
  @Queryable(TYPES.SessionQuery)
  async actionSession(store: TStore, query: SessionQuery): Promise<IResponse<void>> {
    try {
      setProcess(store, 'get session...')
      const resp = await $http.post<SessionQuery, void>('/session', query)
      if(resp.token) {
        return resp
      }
      return Promise.reject(resp)
    } catch(e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }


  /**
   * Start
   */
  @Queryable(TYPES.StartQuery)
  async actionAuthentication(store: TStore): Promise<boolean> {
    try {
      setProcess(store, 'start...')
      await $http.get<IResponse<boolean>>('/start')
      return Promise.resolve(true)
    } catch(e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Ping
   */
  @Queryable(TYPES.PingCommand)
  async actionPing(_: TStore): Promise<string> {
    try {
      await $http.get<string>('/ping')
      return 'pong'
    } catch(e) {
      return Promise.reject()
    }
  }

  /**
   * Check
   */
  @Commandable(TYPES.CheckCommand)
  async actionCheck(store: TStore): Promise<ICheckResponse> {
    try {
      const resp = await $http.get<ICheckResponse>('/check')
      if(!resp || !resp.data) {
        return void 0
      }
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ******* Yandex.Disk API ******
   * ==============================
   */

  /**
   * Create Access Token
   * @param store Store
   * @param {YandexTokenQuery} query
   */
  @Queryable(TYPES.YandexTokenQuery)
  async actionFetchYadexToken(store: TStore, query: YandexTokenQuery): Promise<string> {
    try {
      setProcess(store, 'creating yandex disk token...')
      const resp = await $http.post<YandexTokenQuery, string>('/yandexapi/token', query)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Access token not received')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Refresh Token
   * @param store Store
   * @param {RefreshYandexTokenQuery} query
   */
  @Queryable(TYPES.RefreshYandexTokenQuery)
  async actionRefreshYadexToken(store: TStore, query: RefreshYandexTokenQuery): Promise<boolean> {
    try {
      setProcess(store, 'updating yandex disk token...')
      const resp = await $http.post<RefreshYandexTokenQuery, boolean>('/yandexapi/refreshToken', query)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Access token refresh failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Revoke Token
   * @param store Store
   * @param {RevokeYandexTokenCommand} command
   */
  @Commandable(TYPES.RevokeYandexTokenCommand)
  async actionRevokeYandexToken(store: TStore, command: RevokeYandexTokenCommand): Promise<boolean> {
    try {
      setProcess(store, 'revoke yandex disk token...')
      const resp = await $http.post<RefreshYandexTokenQuery, boolean>('/yandexapi/revokeToken', command)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Access token revoke failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Yandex disk info
   * @param store Store
   * @param {YandexDiskInfoQuery} query
   */
  @Queryable(TYPES.YandexDiskInfoQuery)
  async actionFetchYandexDiskInfo(
    store: TStore, query: YandexDiskInfoQuery
  ): Promise<unknown> {
    try {
      setProcess(store, 'get yandex disk info...')
      const resp = await $http.get<unknown>('/yandexapi/info')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Fetch Yandex Disk info failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Yandex disk resource link
   * @param store Store
   * @param {YandexDiskResourceLinkQuery} query
   */
  @Queryable(TYPES.YandexDiskResourceLinkQuery)
  async fetchResourceLink(
    store: TStore, query: YandexDiskResourceLinkQuery
  ): Promise<string> {
    try {
      const resp = await $http.get<{ link: string }>(`/yandexapi/resource?filename=${query.filename}`)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data.link
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Fetch Yandex Disk info failed')
      return Promise.reject(e)
    }
  }
}

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null)
}

const actions = toActionTree(new Actions())

export default actions
