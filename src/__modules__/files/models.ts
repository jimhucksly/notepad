import { FileType } from './types';

export interface IFile {
  id: string;
  name: string;
  extension: string;
  createDateTime: string;
  size: number;
  href: string;
  type: FileType;
}

export interface IFilesState {
  files: IFile;
}
