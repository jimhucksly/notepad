import { ActionContext, ActionTree } from 'vuex'
import {
  ArchiveRemoveCommand,
  ArchiveRestoreCommand,
  ArchivingCommand,
  CreateProjectCommand,
  DeleteProjectCommand,
  EditProjectCommand,
  UploadFileCommand
} from '~/domain/commands'
import { Commandable } from '~/domain/commands/command.bus'
import {
  IArchive,
  IFile,
  IProjects,
  IProjectsState,
  IRootState
} from '~/domain/models'
import { Queryable } from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
import { Hub } from '~/plugins/hub'
import $http from '../http'

type TStore = ActionContext<IProjectsState, IRootState>

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true })
}

class Actions implements ActionTree<IProjectsState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'projects'

  /**
   * Get Projects
   * @param {Store} store
   */
  @Queryable(TYPES.ProjectsQuery, Actions.namespace)
  async actionFetchProjects(store: TStore): Promise<IProjects> {
    try {
      setProcess(store, 'get projects...')
      const { data } = await $http.get<IProjects>('/projects')
      store.commit('setProjects', data)
      return data
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Projects fetch failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Create New Project
   * @param store Store
   * @param {CreateProjectCommand} command
   */
  @Commandable(TYPES.CreateProjectCommand, Actions.namespace)
  async actionCreateProject(store: TStore, command: CreateProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'creating project...')
      await $http.put<IProjects, boolean>('/project', command.data)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Project creating failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Edit Project
   * @param store Store
   * @param data
   */
  @Commandable(TYPES.EditProjectCommand, Actions.namespace)
  async actionEditProject(store: TStore, command: EditProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'editing project...')
      await $http.post<IProjects, boolean>('/project', command.data)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Project edit failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Delete Project
   * @param store Store
   * @param {DeleteProjectCommand} command
   */
  @Commandable(TYPES.DeleteProjectCommand, Actions.namespace)
  async actionDeleteProject(store: TStore, command: DeleteProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing project...')
      await $http.delete(`/project/?key=${command.stamp}`)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Project delete failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Archiving
   * @param store Store
   * @param {ArchivingCommand} command
   */
  @Commandable(TYPES.ArchivingCommand, Actions.namespace)
  async actionArchiving(store: TStore, command: ArchivingCommand): Promise<boolean> {
    try {
      setProcess(store, 'move project to archive...')
      await $http.put<{ key: string | number }, void>('/project/archive', {
        key: command.stamp
      })
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Project archive failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Get Archives
   * @param store Store
   * @param data
   */
  @Queryable(TYPES.ArchivesQuery, Actions.namespace)
  async actionGetArchives(store: TStore): Promise<Array<IArchive>> {
    try {
      setProcess(store, 'get archives...')
      const resp = await $http.get<Array<IArchive>>('/projects/archives')
      if (!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setArchives', resp.data)
      return resp.data
    } catch (e) {
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Archive Restore
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(TYPES.ArchiveRestoreCommand, Actions.namespace)
  async actionArchiveRestore(store: TStore, command: ArchiveRestoreCommand): Promise<boolean> {
    try {
      setProcess(store, 'archive restore...')
      await $http.post('/project/archive/restore', command)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Archive restore failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Archive Remove
   * @param store Store
   * @param {ArchiveRemoveCommand} command
   */
  @Commandable(TYPES.ArchiveRemoveCommand, Actions.namespace)
  async actionArchiveRemove(store: TStore, command: ArchiveRemoveCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing archive...')
      await $http.delete(`/project/archive/?name=${command.name}`)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Archive remove failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Upload File
   * @param store Store
   * @param {UploadFileCommand} command
   */
  @Commandable(TYPES.UploadFileCommand, Actions.namespace)
  async actionUploadFile(store: TStore, command: UploadFileCommand): Promise<IFile> {
    try {
      setProcess(store, 'uploading file...')
      const resp = await $http.post<FormData, IFile>('/upload', command.file)
      return Promise.resolve(resp.data)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Upload file failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
