import { App } from 'vue';

export default {
  install: (vue: App) => {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const electron = require('electron');
    vue.config.globalProperties.$electron = electron;
  },
};
