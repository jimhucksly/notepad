import { eventBus } from '@dn-web/core';
import { Vue } from 'vue-class-component';
import { uploadFile } from '~/utils/uploadFile';

export default class FilesSidebar extends Vue {
  async add() {
    const event = await uploadFile();
    eventBus.$emit('on-file-change', event);
  }

  // onFileChange(e: InputEvent) {
  //   eventBus.$emit('on-file-change', e);
  // }

  // onFileRemove() {
  //   eventBus.$emit('on-file-remove');
  // }

  // onFileCheck() {
  //   this.filesCheck = !this.filesCheck;
  //   eventBus.$emit('on-file-check', this.filesCheck);
  // }
}
