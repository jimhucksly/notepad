import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import { aliases as vuetifyAliases, md } from 'vuetify/iconsets/md';
import { defaults } from './vuetify';

const icons = {
  defaultSet: 'md',
  iconfont: 'md',
  aliases: {
    ...vuetifyAliases,
  },
  sets: {
    md,
  },
};

const vuetify = createVuetify({
  components,
  defaults: {
    ...defaults,
  },
  icons,
  theme: false,
});

export default vuetify;
