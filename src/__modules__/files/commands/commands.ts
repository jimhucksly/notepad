export class DeleteFileCommand {
  constructor(public id: string) {}
}

export class UploadFileCommand {
  constructor(public form: FormData) {}
}
