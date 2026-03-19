export class AddLibraryFileCommand {
  constructor(public name: string) {}
}

export class DeleteLibraryFileCommand {
  constructor(public id: string) {}
}

export class UpdateLibraryCommand {
  constructor(
    public id: string | number,
    public value: string
  ) {}
}
