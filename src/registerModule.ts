import { App, defineAsyncComponent, defineComponent } from 'vue'
import { IModule, IModuleMaifest } from './domain/interfaces'
import { IRootState } from './domain/models'
import { ModuleTree } from 'vuex'

async function registerModule(_module: IModule, _manifest: IModuleMaifest, app: App): Promise<
  {
    storeModule: ModuleTree<IRootState>
    namespace: string
  }> {
  let storeModule: Record<string, ModuleTree<IRootState>> = null
  const path = _module.path + '/'
  const moduleName = _module.name
  if (_manifest && _manifest.components) {
    for (const key in _manifest.components) {
      switch (key) {
        case 'main':
          if (typeof _manifest.components['main'] === 'string') {
            app.component(moduleName, defineAsyncComponent(() => import('~/__modules__/' + path + _manifest.components['main'])))
          }
          break
        case 'aside':
          const name = moduleName + '-Sidebar'
          if (typeof _manifest.components['aside'] === 'string' && _manifest.components['aside']) {
            app.component(name, defineAsyncComponent(() => import('~/__modules__/' + path + _manifest.components['aside'])))
          } else {
            app.component(name, defineComponent({
              template: '<div></div>'
            }))
          }
          break
        case 'modals':
          for (const item of (_manifest.components['modals'] || [])) {
            app.component(moduleName + '-Modal-' + item, defineAsyncComponent(() => import('~/__modules__/' + path + 'modals/' + item)))
          }
          break
      }
    }
  }
  if (_manifest && _manifest.store) {
    storeModule = {
      [moduleName]: (await import('~/__modules__/' + path + _manifest.store)).default
    }
  }

  return { storeModule: storeModule ? storeModule[moduleName] : null, namespace: moduleName }
}

export {
  registerModule
}
