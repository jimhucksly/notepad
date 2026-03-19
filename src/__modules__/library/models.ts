export interface ILibraryFile {
  id: string;
  name: string; // имя физического файла на сервере
}

export interface ITreeItem {
  id: string;
  name: string;
  slug: string;
  children?: ITreeItem[];
}

export interface ILibraryState {
  libraryData: string;
  libraryFiles: Array<ILibraryFile>;
  libraryFileId: string | number;
  libraryTree: Array<ITreeItem>;
}
