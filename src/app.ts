import { generatePalette } from '@dn-web/core';
import { IPaletteSchemeUnit } from '@dn-web/core/dist/types/palette';
import { Options, Vue } from 'vue-class-component';

@Options({
  template: `
    <router-view></router-view>
    <popup />
    <toasted />
  `,
})
export default class AppComponent extends Vue {
  mounted() {
    window.addEventListener('contextmenu', event => {
      event.preventDefault();
      let selection = null;
      let hasSelection = false;
      if (window.getSelection) {
        const s = window.getSelection();
        selection = s ? s.toString() : '';
        hasSelection = selection ? Boolean(selection.length) : false;
      }
      if (hasSelection) {
        this.$electron.ipcRenderer.send('context-menu-popup');
      }
    });
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css';
    document.getElementsByTagName('head')[0].appendChild(link);

    const colorsDefaults: Array<IPaletteSchemeUnit> = [
      {
        name: 'primary',
        lighten: {
          steps: { l: [52, 58, 64, 70, 76, 82] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [40, 34, 28, 22, 16, 10] },
          prefix: 'd',
        },
        pivot: { h: 215, s: 66, l: 46, a: 100 },
      },
      {
        name: 'secondary',
        lighten: {
          steps: { l: [42, 48, 54, 60, 66, 72] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [30, 24, 18, 12, 6, 0] },
          prefix: 'd',
        },
        pivot: { h: 300, s: 41, l: 36, a: 100 },
      },
      {
        name: 'success',
        lighten: {
          steps: {
            l: [58, 67, 74, 82, 89, 95],
          },
          prefix: 'l',
        },
        darken: {
          steps: {
            l: [44, 38, 32, 25, 20, 10],
          },
          prefix: 'd',
        },
        pivot: { h: 88, s: 100, l: 50, a: 100 },
      },
      {
        name: 'error',
        lighten: {
          steps: { l: [63, 70, 77, 84, 91, 98] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [50, 43, 36, 29, 21, 14] },
          prefix: 'd',
        },
        pivot: { h: 346, s: 100, l: 57, a: 100 },
      },
      {
        name: 'warning',
        lighten: {
          steps: { l: [80, 89, 98] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [62, 53, 44, 35] },
          prefix: 'd',
        },
        pivot: { h: 50, s: 100, l: 71, a: 100 },
      },
      {
        name: 'grey',
        lighten: {
          steps: { l: [71, 77, 83, 89, 93, 96] },
          prefix: 'l',
        },
        darken: {
          steps: { l: [56, 47, 38, 29, 20, 10] },
          prefix: 'd',
        },
        pivot: { h: 220, s: 5, l: 65, a: 100 },
      },
      {
        name: 'shade',
        lighten: {
          steps: { a: [90, 80, 70, 60, 50, 40, 30, 20, 10, 7, 5, 3] },
          prefix: (steps, index) => ('0' + String(steps['a'][index])).slice(-2),
        },
        pivot: { h: 219, s: 83, l: 14, a: 100 },
      },
      {
        name: 'dark',
        pivot: { h: 218, s: 83, l: 14, a: 100 },
      },
    ];

    const palette = document.createElement('style');
    palette.innerHTML = generatePalette(colorsDefaults);
    palette.id = 'ldmui-palette';
    document.body.appendChild(palette);
  }
}
