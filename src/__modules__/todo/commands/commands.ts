import { ITodoItem, ITodoOrder } from '../models';

export class TodoOrderCommand {
  constructor(public result: ITodoOrder) {}
}

export class UpdateTodoCommand {
  constructor(public item: ITodoItem) {}
}

export class DeleteTodoCommand {
  constructor(public id: string) {}
}
