export interface IFile {
  id: string
  name: string
  extension: string
  createDateTime: string
  size: number
  href: string
}

export interface IFilesState {
  files: IFile
}
