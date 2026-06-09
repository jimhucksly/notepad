import 'reflect-metadata';
import '~/assets/scss/main.scss';
import '~/assets/css/md-editor.css';
import { createApp, defineComponent } from 'vue';
import { ModuleTree, Store } from 'vuex';
import Titlebar from '~/components/titlebar';
// import Popup from '~/components/popup';
// import Toasted from '~/components/toasted';
// import BCheckbox from '~/components/bcheckbox';
// import BBtn from '~/components/bbtn';
// import BTabs, { BTab } from '~/components/btabs';
// import SvgIcon from '~/components/svgIcon';
// import Loader from '~/components/loader';
// import AboutPopup from '~/components/popup/about';
// import CodeInput from '~/components/codeInput';
// import BSplitter from '~/components/bsplitter';
import AnimePlugin from '~/plugins/anime';
// import ToastedPlugin from '~/plugins/toasted';
import AppPlugin from '~/plugins/app';
import ElectronPlugin from '~/plugins/electron';
import SocketPlugin from '~/plugins/socket';
import Validate from '~/plugins/validate';
import root from './app';
import Application from './application/app';
import { buildContainer } from './domain/container';
import { IManifest, IModuleMaifest } from './domain/interfaces';
import { IRootState } from './domain/models';
import { bindings } from './domain/types';
import { createInterceptors } from './http';
import { registerModule } from './registerModule';
import router from './router';
import { buildStore } from './store';
import vuetify from './vuetify.setup';

async function init() {
  try {
    const manifestURL = $DEV ? '/manifest.json' : 'manifest.json';
    const response: { json: () => Promise<IManifest>; status: number } = await fetch(manifestURL);
    if (response.status === 404) {
      throw new Error('Manifest is not found');
    }
    const manifest: IManifest = await response.json();

    const isDev = process.env.NODE_ENV === 'development';

    const app = createApp(root);

    const storeModules: ModuleTree<IRootState> = {};

    for (const _module of manifest.main) {
      const path = _module.path + '/';

      /* eslint-disable-next-line @typescript-eslint/no-require-imports */
      const _manifest: IModuleMaifest = require('~/__modules__/' + path + 'manifest.json');
      if (_manifest) {
        const data = registerModule(_module, _manifest, app);
        if (data && data.storeModule && data.namespace) {
          storeModules[data.namespace] = { ...data.storeModule };
        }
      }
    }

    const store = buildStore(storeModules);

    store.commit('setManifest', manifest);

    const container = buildContainer();
    container.bind<Store<IRootState>>(bindings.Store).toConstantValue(store);

    app.component('Titlebar', Titlebar);
    // app.component('Popup', Popup);
    // app.component('Toasted', Toasted);
    // app.component('SvgIcon', SvgIcon);
    // app.component('Loader', Loader);
    // app.component('BCheckbox', BCheckbox);
    // app.component('BBtn', BBtn);
    // app.component('BTabs', BTabs);
    // app.component('BTab', BTab);
    // app.component('AboutPopup', AboutPopup);
    // app.component('CodeInput', CodeInput);
    // app.component('BSplitter', BSplitter);

    const $app: Application = container.get(bindings.Application);

    app.use(store);
    app.use(router);
    app.use(vuetify);
    app.use(AppPlugin, { app: $app });
    app.use(ElectronPlugin);
    app.use(AnimePlugin);
    app.use(SocketPlugin, { store });
    app.use(Validate);

    createInterceptors(store);

    app.config.globalProperties.$dateFormat = (date: string | Date) => {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleString('ru');
    };

    if (isDev && window && window.location) {
      (window as unknown as { reload: () => void }).reload = window.location.reload.bind(window.location);
    }

    app.mount('#app');
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e);
    const error = defineComponent({
      components: {
        Titlebar,
      },
      data() {
        return {
          error: e.message || 'Unrecognized error',
        };
      },
      template: `
        <titlebar />
        <div class="flex-center items-center basis-100">Error: {{ error }}</div>
      `,
    });
    const app = createApp(error);
    // app.component('SvgIcon', SvgIcon);
    // app.component('Loader', Loader);
    app.mount('#app');
  }
}

init();
