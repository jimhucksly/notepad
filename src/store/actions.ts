import {
  IRootState,
  IResponse,
  IUser
} from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Queryable } from '~/domain/queries/query.bus'
import { Commandable } from '~/domain/commands/command.bus'
import {
  AuthQuery,
  RefreshYandexTokenQuery,
  SessionQuery,
  YandexDiskResourceLinkQuery,
  YandexTokenQuery
} from '~/domain/queries'
import {
  AuthCommand,
  RegistrationCommand,
  ResendCodeCommand,
  ResetPasswordCommand,
  RevokeYandexTokenCommand,
  UpdatePasswordCommand,
  VerifyCommand
} from '~/domain/commands'
import { ActionTree, ActionContext } from 'vuex'
import { Hub } from '~/plugins/hub'
import { toActionTree } from '~/helpers'
import $http from '~/http'

type TStore = ActionContext<IRootState, IRootState>

class Actions implements ActionTree<IRootState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  /**
   * Registration
   * @param store Store
   * @param {RegistrationCommand} command
   */
  @Commandable(TYPES.RegistrationCommand)
  async actionReg(store: TStore, command: RegistrationCommand): Promise<IResponse<boolean>> {
    try {
      setProcess(store, 'registration...')
      return await $http.post<RegistrationCommand, boolean>('/signup', command)
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  @Commandable(TYPES.AuthCommand)
  auth(store: TStore, command: AuthCommand) {
    store.commit('setIsAuth', command.flag)
  }

  /**
   * Auth
   * @param store Store
   * @param {AuthQuery} command
   */
  @Queryable(TYPES.AuthQuery)
  async actionAuth(store: TStore, query: AuthQuery): Promise<IResponse<void>> {
    try {
      setProcess(store, 'authentication...')
      return await $http.post<AuthQuery, void>('/auth', {
        login: query.login,
        password: query.password
      })
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Verify
   * @param store Store
   * @param {VerifyCommand} command
   */
  @Commandable(TYPES.VerifyCommand)
  async actionVerify(store: TStore, command: VerifyCommand): Promise<IResponse<boolean>> {
    try {
      setProcess(store, 'verifying...')
      const user = store.getters.getCurrentUser
      return await $http.post<VerifyCommand & { userId: number }, boolean>('/verify', {
        userId: user.id,
        code: command.code
      })
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Resend code
   * @param store Store
   * @param {ResendCodeCommand} command
   */
  @Commandable(TYPES.ResendCodeCommand)
  async actionResend(store: TStore, command: ResendCodeCommand): Promise<IResponse<void>> {
    try {
      setProcess(store, 'resend code...')
      const user = store.getters.getCurrentUser
      return await $http.post<ResendCodeCommand, void>('/resend', {
        userId: user.id
      })
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Reset pass
   * @param store Store
   * @param {ResetPasswordCommand} command
   */
  @Commandable(TYPES.ResetPasswordCommand)
  async actionResetPass(store: TStore, command: ResetPasswordCommand): Promise<IResponse<IUser>> {
    try {
      setProcess(store, 'reset password...')
      return await $http.post<ResetPasswordCommand, IUser>('/reset', command)
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Update pass
   * @param store Store
   * @param {UpdatePasswordCommand} command
   */
  @Commandable(TYPES.UpdatePasswordCommand)
  async actionUpdatePass(store: TStore, command: UpdatePasswordCommand): Promise<IResponse<boolean>> {
    try {
      setProcess(store, 'update password...')
      return await $http.post<UpdatePasswordCommand, boolean>('/update', command)
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Session
   * @param store Store
   * @param {SessionQuery} query
   */
  @Queryable(TYPES.SessionQuery)
  async actionSession(store: TStore, query: SessionQuery): Promise<IUser> {
    try {
      setProcess(store, 'get session...')
      const { data } = await $http.get<IUser>('/session')
      store.commit('setCurrentUser', data)
      return data
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
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
  async actionFetchYadexToken(store: TStore, query: YandexTokenQuery): Promise<IResponse<string>> {
    try {
      setProcess(store, 'creating yandex disk token...')
      return await $http.post<YandexTokenQuery, string>('/ydtoken', query)
    } catch (e) {
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
      await $http.post<RefreshYandexTokenQuery, boolean>('/ydtoken/refresh', query)
      return true
    } catch (e) {
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
      await $http.post<RefreshYandexTokenQuery, boolean>('/ydtoken/revoke', command)
      return true
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Access token revoke failed')
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
      if (!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data.link
    } catch (e) {
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
