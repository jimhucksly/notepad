import { Commandable } from './domain/commands/command.bus'
import { Queryable } from './domain/queries/query.bus'

import { ConfirmWindowQuery } from '~/domain/queries/confirmWindow.query'
import { CreateEditQuery } from '~/domain/queries/createEdit.query'

import * as Types from './domain/models'

import Editor from '~/lib/vue-ace-editor'

import { Hub } from '~/plugins/hub'

const Queries = {
  ConfirmWindowQuery,
  CreateEditQuery
}

const Libs = {
  Editor
}

const Plugins = {
  Hub
}

export {
  Commandable,
  Queryable,
  Queries,
  Types,
  Libs,
  Plugins
}
