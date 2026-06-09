import { App, defineComponent } from 'vue';
import { ModuleTree } from 'vuex';
import { IModule, IModuleMaifest } from './domain/interfaces';
import { IRootState } from './domain/models';

function registerModule(
  _module: IModule,
  _manifest: IModuleMaifest,
  app: App
): {
  storeModule: ModuleTree<IRootState>;
  namespace: string;
} {
  let storeModule: Record<string, ModuleTree<IRootState>> = null;
  const moduleName = _module.name;
  const modulePath = _module.path + '/';
  if (_manifest && _manifest.components) {
    for (const key in _manifest.components) {
      switch (key) {
        case 'main':
          if (typeof _manifest.components['main'] === 'string') {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */
            const m = require('~/__modules__/' + modulePath + _manifest.components['main']);
            app.component(moduleName, defineComponent(m.default));
          }
          break;
        case 'aside':
          const name = moduleName + '-Sidebar';
          if (typeof _manifest.components['aside'] === 'string' && _manifest.components['aside']) {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */
            const m = require('~/__modules__/' + modulePath + _manifest.components['aside']);
            app.component(name, defineComponent(m.default));
          } else {
            app.component(
              name,
              defineComponent({
                template: '<div></div>',
              })
            );
          }
          break;
        case 'modals':
          for (const item of _manifest.components['modals'] || []) {
            /* eslint-disable-next-line @typescript-eslint/no-require-imports */
            const m = require('~/__modules__/' + modulePath + 'modals/' + item);
            app.component(moduleName + '-Modal-' + item, defineComponent(m.default));
          }
          break;
      }
    }
  }
  if (_manifest && _manifest.store) {
    storeModule = {
      /* eslint-disable-next-line @typescript-eslint/no-require-imports */
      [moduleName]: require('~/__modules__/' + modulePath + _manifest.store).default,
    };
  }

  return { storeModule: storeModule ? storeModule[moduleName] : null, namespace: moduleName };
}

export { registerModule };
