import Editor from '~/lib/vue-ace-editor';
import { Commandable } from './domain/commands/command.bus';
import * as Types from './domain/models';
import { Queryable } from './domain/queries/query.bus';

const Queries = {};

const Libs = {
  Editor,
};

const Plugins = {};

export { Commandable, Queryable, Queries, Types, Libs, Plugins };
