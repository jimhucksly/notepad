import { App } from 'vue';

export default {
  install: (vue: App) => {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const electron = require('electron');
    vue.config.globalProperties.$electron = electron;
  },
};
