const bindings = {
  TodoQuery: Symbol.for('TodoQuery'),
  UpdateTodoCommand: Symbol.for('UpdateTodoCommand'),
  DeleteTodoCommand: Symbol.for('DeleteTodoCommand'),
  TodoOrderCommand: Symbol.for('TodoOrderCommand')
}

export {
  bindings
}
