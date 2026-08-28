import cloneDeep from 'lodash/cloneDeep';
import { ActionContext, ActionTree } from 'vuex';
import { Commandable, Queryable, Types } from '~/core';
import { toActionTree } from '~/helpers';
import $http from '~/http';
import {
  ArchiveRemoveCommand,
  ArchiveRestoreCommand,
  ArchivingCommand,
  CreateProjectCommand,
  DeleteProjectCommand,
  EditProjectCommand,
  ReadCommand,
} from '../commands/commands';
import { IArchive, IProjects, IProjectsState } from '../models';
import { bindings } from './bindings';
import { eventBus } from '@dn-web/core';

type TStore = ActionContext<IProjectsState, Types.IRootState>;

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true });
}

class Actions implements ActionTree<IProjectsState, Types.IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any;

  static readonly namespace = 'Projects';

  /**
   * Get Projects
   * @param {Store} store
   */
  @Queryable(bindings.ProjectsQuery, Actions.namespace)
  async actionFetchProjects(store: TStore): Promise<IProjects> {
    try {
      setProcess(store, 'get projects...');
      const { data } = await $http.get<IProjects>('/projects');
      store.commit('setProjects', data);
      return data;
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Projects fetch failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  @Commandable(bindings.ReadCommand)
  read(store: TStore, command: ReadCommand): void {
    const json = cloneDeep(store.getters['getJson']);
    delete json[command.stamp]['unread'];
    store.commit('projects/setJson', json);
  }

  /**
   * Create New Project
   * @param store Store
   * @param {CreateProjectCommand} command
   */
  @Commandable(bindings.CreateProjectCommand, Actions.namespace)
  async actionCreateProject(store: TStore, command: CreateProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'creating project...');
      await $http.put<IProjects, boolean>('/project', command.data);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Project creating failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Edit Project
   * @param store Store
   * @param data
   */
  @Commandable(bindings.EditProjectCommand, Actions.namespace)
  async actionEditProject(store: TStore, command: EditProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'editing project...');
      await $http.post<IProjects, boolean>('/project', command.data);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Project edit failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Delete Project
   * @param store Store
   * @param {DeleteProjectCommand} command
   */
  @Commandable(bindings.DeleteProjectCommand, Actions.namespace)
  async actionDeleteProject(store: TStore, command: DeleteProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing project...');
      await $http.delete(`/project/?key=${command.stamp}`);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Project delete failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Archiving
   * @param store Store
   * @param {ArchivingCommand} command
   */
  @Commandable(bindings.ArchivingCommand, Actions.namespace)
  async actionArchiving(store: TStore, command: ArchivingCommand): Promise<boolean> {
    try {
      setProcess(store, 'move project to archive...');
      await $http.put<{ key: string | number }, void>('/project/archive', {
        key: command.stamp,
      });
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Project archive failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Get Archives
   * @param store Store
   * @param data
   */
  @Queryable(bindings.ArchivesQuery, Actions.namespace)
  async actionGetArchives(store: TStore): Promise<Array<IArchive>> {
    try {
      setProcess(store, 'get archives...');
      const { data } = await $http.get<Array<IArchive>>('/projects/archives');
      store.commit('setArchives', data);
      return data;
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Archive Restore
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(bindings.ArchiveRestoreCommand, Actions.namespace)
  async actionArchiveRestore(store: TStore, command: ArchiveRestoreCommand): Promise<boolean> {
    try {
      setProcess(store, 'archive restore...');
      await $http.post('/project/archive/restore', command);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Archive restore failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Archive Remove
   * @param store Store
   * @param {ArchiveRemoveCommand} command
   */
  @Commandable(bindings.ArchiveRemoveCommand, Actions.namespace)
  async actionArchiveRemove(store: TStore, command: ArchiveRemoveCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing archive...');
      await $http.delete(`/project/archive/?id=${command.id}`);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Archive remove failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }
}

const actions = toActionTree(new Actions());

export default actions;
