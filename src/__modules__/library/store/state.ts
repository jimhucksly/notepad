import { ILibraryState } from '../models';

export const stateKeys: string[] = ['libraryData', 'libraryFiles', 'libraryFileId', 'libraryTree'];

const state: ILibraryState = {
  libraryData: '',
  libraryFiles: null,
  libraryFileId: null,
  libraryTree: [],
};

export default state;
