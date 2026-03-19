import { App } from 'vue';
import { Hub } from '~/plugins/hub';

export interface IToasted {
  success: (v: string) => void;
  error: (v: string) => void;
}

class Toasted {
  success(subject: string) {
    Hub.$emit('on-toasted-success', subject);
  }

  error(subject: string) {
    Hub.$emit('on-toasted-error', subject);
  }
}

export default {
  install: (vue: App) => {
    const toasted = new Toasted();
    vue.config.globalProperties.$toasted = toasted;
    vue.provide('toasted', toasted);
  },
};
