import { ILink } from '../models'

export class UpdateLinksCommand {
  constructor(public link: ILink) {}
}

export class DeleteLinkCommand {
  constructor(public id: string) {}
}
