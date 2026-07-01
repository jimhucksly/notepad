import { Vue } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import Application from '../src/application/app';
import { IRootState } from '../src/domain/models';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    functional?: boolean;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $app: Application;
    $store: Vuex.Store<IRootState>;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    $electron: any;
    $slideUp: (elem: HTMLElement, duration: number) => void;
    $slideDown: (elem: HTMLElement, duration: number) => void;
    $toasted: {
      success: (subject: string) => void;
      error: (subject: string) => void;
    };
    $validate: (instance: ComponentPublicInstance) => void;
    $dateFormat: (date: string | Date) => string;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $options?: any;
  }
}
