import { Options, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { Queries } from '~/core';
import { dragAndDropLoader } from '~/helpers';
import { Hub } from '~/plugins/hub';
import { DeleteFileCommand, UploadFileCommand } from './commands/commands';
import File from './file';
import { IFile } from './models';
import { FilesQuery } from './queries/queries';

@Options({
  components: {
    File,
  },
})
export default class Files extends Vue {
  @Getter('Files/getFiles') files: Array<IFile>;

  selected: string = null;
  uploading = false;
  checking = false;
  checkeds: Array<string> = [];

  onFileChangeHandler: (e: InputEvent) => void;
  onFileRemoveHandler: () => void;
  onFileDownloadHandler: () => void;
  onFileCheckHandler: (value: boolean) => void;

  created() {
    this.fetchFiles();
    this.onFileChangeHandler = this.onFileChange.bind(this);
    Hub.$on('on-file-change', this.onFileChangeHandler);
    this.onFileRemoveHandler = this.onFileRemove.bind(this);
    Hub.$on('on-file-remove', this.onFileRemoveHandler);
    this.onFileDownloadHandler = this.onFileDownload.bind(this);
    Hub.$on('on-file-download', this.onFileDownloadHandler);
    this.onFileCheckHandler = this.onFileCheck.bind(this);
    Hub.$on('on-file-check', this.onFileCheckHandler);
  }

  mounted() {
    dragAndDropLoader('drop-area', 'hightlight', this.onFileChange.bind(this));
    window.ondragstart = () => false;
  }

  beforeUnmount() {
    Hub.$off('on-file-change', this.onFileChangeHandler);
    Hub.$off('on-file-remove', this.onFileRemoveHandler);
    Hub.$off('on-file-download', this.onFileDownloadHandler);
  }

  async fetchFiles() {
    await this.$app.$queryBus.exec(new FilesQuery());
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

  async onFileRemove() {
    if (!this.selected && !this.checkeds?.length) {
      return;
    }
    let question = 'Do you realy want to remove this file?';
    if (this.checkeds.length) {
      question = `Do you realy want to remove ${this.checkeds.length} files?`;
    }
    const isConfirm = await this.$app.$queryBus.exec(new Queries.ConfirmWindowQuery(question));
    if (!isConfirm) {
      return;
    }
    for (const id of this.selected ? [this.selected] : this.checkeds) {
      await this.$app.$commandBus.do(new DeleteFileCommand(id));
    }
    await this.fetchFiles();
    this.selected = null;
    this.checkeds = [];
    this.checking = false;
    Hub.$emit('on-file-select', null);
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

  onFileDownload() {
    if (!this.selected) {
      return;
    }
    const found = this.files.find(f => f.id === this.selected);
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

  onSelect(id: string) {
    this.selected = id;
    Hub.$emit(
      'on-file-select',
      this.files.find(f => f.id === id)
    );
  }

  onFileCheck(value: boolean) {
    if (!this.files.length) {
      return;
    }
    this.checking = value;
    this.selected = null;
    if (!value) {
      this.checkeds = [];
    }
  }

  onCheck(id: string) {
    if (this.checkeds.includes(id)) {
      this.checkeds = this.checkeds.filter(el => el !== id);
    } else {
      this.checkeds.push(id);
    }
  }
}
