import { ActionContext, ActionTree } from 'vuex';
import { Commandable, Plugins, Queryable, Types } from '~/core';
import { toActionTree } from '~/helpers';
import $http from '~/http';
import { DeleteFileCommand, UploadFileCommand } from '../commands/commands';
import { IFile, IFilesState } from '../models';
import { bindings } from './bindings';

type TStore = ActionContext<IFilesState, Types.IRootState>;

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true });
}

class Actions implements ActionTree<IFilesState, Types.IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any;

  static readonly namespace = 'Files';

  /**
   * Get Files
   * @param store Store
   */
  @Queryable(bindings.FilesQuery, Actions.namespace)
  async actionGetFiles(store: TStore): Promise<Array<IFile>> {
    try {
      setProcess(store, 'get files...');
      const { data } = await $http.get<Array<IFile>>('/files');
      store.commit('setFiles', data);
      return data;
    } catch (e) {
      Plugins.Hub.$emit('on-toasted-error', 'Error: Files list fetch failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Delete File
   * @param store Store
   * @param {DeleteFileCommand} command
   */
  @Commandable(bindings.DeleteFileCommand, Actions.namespace)
  async actionRemoveFile(store: TStore, command: DeleteFileCommand): Promise<boolean> {
    try {
      setProcess(store, 'delete file...');
      await $http.delete(`/files?id=${command.id}`);
      return true;
    } catch (e) {
      Plugins.Hub.$emit('on-toasted-error', 'Error: File removing is failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Upload File
   * @param store Store
   * @param {UploadFileToProjectCommand} command
   */
  @Commandable(bindings.UploadFileCommand, Actions.namespace)
  async actionUploadFile(store: TStore, command: UploadFileCommand): Promise<true> {
    try {
      setProcess(store, 'uploading file...');
      await $http.put('/upload', command.form);
      return true;
    } catch (e) {
      Plugins.Hub.$emit('on-toasted-error', 'Error: Upload file failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }
}

const actions = toActionTree(new Actions());

export default actions;
