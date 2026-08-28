import { eventBus } from '@dn-web/core';
import { Vue } from 'vue-class-component';
import { IFile } from './models';

export default class FilesSidebar extends Vue {
  fileSelected: IFile = null;
  filesCheck = false;

  onFileSelectHandler: (file: IFile) => void;

  created() {
    this.onFileSelectHandler = this.onFileSelect.bind(this);
    eventBus.$on('on-file-select', this.onFileSelectHandler);
  }

  beforeUnmount() {
    eventBus.$off('on-file-select', this.onFileSelectHandler);
  }

  onFileSelect(file: IFile) {
    this.fileSelected = file;
  }

  onFileChange(e: InputEvent) {
    eventBus.$emit('on-file-change', e);
  }

  onFileRemove() {
    eventBus.$emit('on-file-remove');
  }

  onFileCheck() {
    this.filesCheck = !this.filesCheck;
    eventBus.$emit('on-file-check', this.filesCheck);
  }

  onFileDownload() {
    eventBus.$emit('on-file-download');
  }
}
