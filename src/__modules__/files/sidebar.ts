import { Vue } from 'vue-class-component';
import { Plugins } from '~/core';
import { IFile } from './models';

export default class FilesSidebar extends Vue {
  fileSelected: IFile = null;
  filesCheck = false;

  onFileSelectHandler: (file: IFile) => void;

  created() {
    this.onFileSelectHandler = this.onFileSelect.bind(this);
    Plugins.Hub.$on('on-file-select', this.onFileSelectHandler);
  }

  beforeUnmount() {
    Plugins.Hub.$off('on-file-select', this.onFileSelectHandler);
  }

  onFileSelect(file: IFile) {
    this.fileSelected = file;
  }

  onFileChange(e: InputEvent) {
    Plugins.Hub.$emit('on-file-change', e);
  }

  onFileRemove() {
    Plugins.Hub.$emit('on-file-remove');
  }

  onFileCheck() {
    this.filesCheck = !this.filesCheck;
    Plugins.Hub.$emit('on-file-check', this.filesCheck);
  }

  onFileDownload() {
    Plugins.Hub.$emit('on-file-download');
  }
}
