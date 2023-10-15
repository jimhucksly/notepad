import { App, defineAsyncComponent } from 'vue'
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
  if (_manifest && _manifest.components) {
    for (const key in _manifest.components) {
      switch (key) {
        case 'main':
          app.component(_module.name, defineAsyncComponent(() => import('~/__modules__/' + path + _manifest.components['main'])))
          break
        case 'aside':
          app.component(_module.name + '-Sidebar', defineAsyncComponent(() => import('~/__modules__/' + path + _manifest.components['aside'])))
          break
        case 'modals':
          for (const item of _manifest.components['modals']) {
            app.component(_module.name + '-Modal-' + item, defineAsyncComponent(() => import('~/__modules__/' + path + 'modals/' + item)))
          }
          break
      }
    }
  }
  if (_manifest && _manifest.store) {
    storeModule = {
      [_module.name]: (await import('~/__modules__/' + path + _manifest.store)).default
    }
  }

  return { storeModule: storeModule[_module.name], namespace: _module.name }
}

export {
  registerModule
}
