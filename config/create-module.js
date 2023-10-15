(async function () {
  var prompt = require('prompt');
  var fs = require('fs');
  var path = require('path');

  var modulesPath = path.resolve(__dirname, '../src/__modules__')

  prompt.start();

  var schema = {
    properties: {
      name: {
        message: 'Module name',
        required: true
      },
      path: {
        message: 'Module path',
        required: true
      }
    }
  };

  prompt.get(schema, function (err, result) {

    if (result) {
      try {
        const modulePath = path.join(modulesPath, result.path)
        fs.mkdir(modulePath, (err, data) => {
          if (err) {
            return;
          }
          const manifestBody = {
            "components": {
              "main": "",
              "aside": "",
              "modals": []
            },
            "store": ""
          }
          fs.writeFileSync(path.join(modulePath, 'manifest.json'), JSON.stringify(manifestBody, null, '\t'));
          fs.writeFileSync(path.join(modulePath, 'models.ts'), '');
          fs.mkdir(path.join(modulePath, 'commands'), (err, data) => {
            fs.writeFileSync(path.join(modulePath, 'commands/commands.ts'), '')
          });
          fs.mkdir(path.join(modulePath, 'queries'), (err, data) => {
            fs.writeFileSync(path.join(modulePath, 'queries/queries.ts'), '')
          });
          fs.mkdir(path.join(modulePath, 'modals'), (err, data) => {
            //
          });
          fs.mkdir(path.join(modulePath, 'store'), (err, data) => {
            fs.writeFileSync(
              path.join(modulePath, 'store/state.ts'),
              `export const stateKeys: Array<string> = []\n\nconst state = {}\n\nexport default state\n`
            );
            fs.writeFileSync(
              path.join(modulePath, 'store/actions.ts'),
              `import { ActionContext, ActionTree } from 'vuex'\nimport { toActionTree } from '~/helpers'\nimport $http from '~/http'\nimport { bindings } from './bindings'\n\ntype TStore = ActionContext<..., IRootState>\n\nfunction setProcess(store: TStore, process: string | null) {\n\tstore.commit('setProcess', process ? { name: process } : null, { root: true })\n}\n\nclass Actions implements ActionTree<..., IRootState> {\n\t/* eslint-disable-next-line @typescript-eslint/no-explicit-any */\n\t[key: string]: (injectee: TStore, payload: any) => any\n\n\tstatic readonly namespace = '${result.name}'\n}\n\nconst actions = toActionTree(new Actions())\n\nexport default actions\n`
            );
            fs.writeFileSync(
              path.join(modulePath, 'store/index.ts'),
              `import { Module } from 'vuex'\nimport { IRootState } from '~/domain/models'\nimport state from './state'\nimport getters from './getters'\nimport actions from './actions'\nimport mutations from './mutations'\nimport { ... } from '../models'\n\nconst namespaced = true\n\nconst links: Module<..., IRootState> = {\n\tnamespaced,\n\tstate,\n\tgetters,\n\tactions,\n\tmutations\n}\n\nexport default links\n`
            );
            fs.writeFileSync(
              path.join(modulePath, 'store/getters.ts'),
              `import { GetterTree } from 'vuex'\nimport { IRootState } from '~/domain/models'\nimport { upperFirst } from '~/helpers'\nimport { stateKeys } from './state'\nimport { ... } from '../models'\n\nconst getters: GetterTree<..., IRootState> = {}\n\nstateKeys.forEach(key => {\n\tconst getterKey = 'get' + upperFirst(key)\n\tif (getters[getterKey] === undefined) {\n\t\tgetters[getterKey] = state => {\n\t\t\treturn state[key as keyof ...]\n\t\t}\n\t}\n})\n\nexport default getters\n`
            );
            fs.writeFileSync(
              path.join(modulePath, 'store/mutations.ts'),
              `import { MutationTree } from 'vuex'\nimport { upperFirst } from '~/helpers'\nimport { stateKeys } from './state'\nimport { ... } from '../models'\n\nconst _mutations: MutationTree<...> = {}\n\nstateKeys.forEach(key => {\n\tconst commitKey = 'set' + upperFirst(key)\n\tif (_mutations[commitKey] === undefined) {\n\t\t_mutations[commitKey] = (state, payload) => {\n\t\t\tstate[key as keyof ...] = payload\n\t\t}\n\t}\n})\n\nconstmutations: MutationTree<...> = {\n\t..._mutations\n}\n\nexport default mutations\n`
            );
            fs.writeFileSync(path.join(modulePath, 'store/bindings.ts'), `const bindings = {\n}\n\nexport {\n\tbindings\n}\n`);
          })
        });
      } catch (e) {
        //
      }
    }

  });

})();











