import { IEvent } from '../models'

export class UpdateEventCommand {
  constructor(public event: IEvent) {}
}

export class DeleteEventCommand {
  constructor(public date: string) {}
}
