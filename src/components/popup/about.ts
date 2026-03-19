import { Vue } from 'vue-class-component';
import { AUTHOR, VK } from '~/constants';

export default class AboutPopupComponent extends Vue {
  appName = '';

  created() {
    this.$electron.ipcRenderer.send('get-window-title');
    this.$electron.ipcRenderer.on('set-window-title', (e: Electron.IpcRendererEvent, title: string) => {
      this.appName = title;
    });
  }

  get author() {
    return AUTHOR;
  }

  get vk() {
    return VK;
  }
}
