import { eventBus } from '@dn-web/core';
import { ConfirmDialog, DialogManager } from '@dn-web/ui';
import { Options, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { dragAndDropLoader } from '~/helpers';
import { DeleteFileCommand, UploadFileCommand } from './commands/commands';
import File from './file';
import { IFile } from './models';
import { FilesQuery } from './queries/queries';
import { FileType, fileTypes } from './types';

@Options({
  components: {
    File,
  },
})
export default class Files extends Vue {
  @Getter('Files/getFiles') files: Array<IFile>;

  selected: IFile = null;
  loading = false;
  uploading = false;

  rows: Record<number, number> = { 0: 0 };
  filter: string = null;

  onFileChangeHandler: (e: InputEvent) => void;

  created() {
    this.fetchFiles();
    this.onFileChangeHandler = this.onFileChange.bind(this);
    eventBus.$on('on-file-change', this.onFileChangeHandler);
  }

  mounted() {
    dragAndDropLoader('drop-area', 'hightlight', this.onFileChange.bind(this));
    window.ondragstart = () => false;
  }

  beforeUnmount() {
    eventBus.$off('on-file-change', this.onFileChangeHandler);
  }

  async fetchFiles() {
    try {
      this.loading = true;
      await this.$app.$queryBus.exec(new FilesQuery());
    } catch (e) {
      //
    } finally {
      this.loading = false;
    }
  }

  onFileChange(e: InputEvent | DragEvent) {
    const target = e.target as HTMLInputElement;
    let files = target.files;
    if (!files?.length) {
      files = (e as DragEvent).dataTransfer.files;
    }
    if (files?.length === 0) {
      return;
    }
    const formData = new FormData();
    let i = 0;
    for (const f of files) {
      formData.append(`file${++i}`, f);
    }
    this.upload(formData);
  }

  async upload(formData: FormData) {
    try {
      this.uploading = true;
      await this.$app.$commandBus.do(new UploadFileCommand(formData));
      this.fetchFiles();
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    } finally {
      this.uploading = false;
    }
  }

  download() {
    if (!this.selected) {
      return;
    }
    const found = this.files.find(f => f.id === this.selectedId);
    if (found) {
      const a = document.createElement('a');
      a.href = found.href;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(found.href);
      }, 0);
    }
  }

  async remove() {
    if (!this.selected) {
      return;
    }
    const isConfirm = await DialogManager.exec(
      new ConfirmDialog({
        title: 'Confirmation',
        content: 'Do you realy want to remove this file?',
      })
    );
    if (!isConfirm) {
      return;
    }
    await this.$app.$commandBus.do(new DeleteFileCommand(this.selectedId));
    await this.fetchFiles();
    this.selected = null;
    eventBus.$emit('on-file-select', null);
  }

  onSelect(id: string) {
    this.selected = this.files.find(f => f.id === id);
  }

  onUpdateRow(row: number, h: number) {
    if (this.rows[row] && h > this.rows[row]) {
      this.rows[row] = h;
      return;
    }
    this.rows[row] = h;
  }

  get items() {
    return Object.keys(FileType).sort((a, b) => a.localeCompare(b));
  }

  get selectedId(): string {
    return this.selected?.id;
  }

  get filtered(): Array<IFile> {
    if (Array.isArray(this.files) && this.filter) {
      const extensions = fileTypes
        .get((FileType as unknown as Record<string, string>)[this.filter])
        .extensions.reduce((acc, arr) => {
          acc.push(...arr);
          return acc;
        }, []);
      return this.files.filter(f => extensions.includes(f.extension));
    }
    return this.files;
  }
}
