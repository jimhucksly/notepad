import { ConfirmDialog, CreateEditDialog, DialogManager } from '@dn-web/ui';
import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { AddLibraryFileCommand, DeleteLibraryFileCommand } from '../commands/commands';
import { ILibraryFile } from '../models';
import { LibraryFilesQuery } from '../queries/queries';

export default class LibraryFiles extends Vue {
  @Prop() expanded: boolean;

  @Mutation('Library/setLibraryFileId') setFileId: (id: string | number) => void;

  @Getter('Library/getLibraryFiles') libraryFiles: Array<ILibraryFile>;
  @Getter('Library/getLibraryFileId') currentId: string;

  idForDelete = '';

  openFile(file: ILibraryFile) {
    this.setFileId(file.id);
    this.$emit('hide');
  }

  async add() {
    const result: ILibraryFile = await DialogManager.exec(
      new CreateEditDialog({
        title: 'Add library file',
        component: 'Library-Modal-createEditFile',
        componentProps: {
          model: null,
        },
        width: '30%',
      })
    );
    if (!result) {
      return;
    }
    await this.$app.$commandBus.do(new AddLibraryFileCommand(result.name));
  }

  async removeFile(file: ILibraryFile) {
    const isConfirm = await DialogManager.exec(
      new ConfirmDialog({
        title: 'Confirm',
        content: 'Do you want to remove the library file?',
      })
    );
    if (!isConfirm) {
      return;
    }
    try {
      await this.$app.$commandBus.do(new DeleteLibraryFileCommand(file.id));
      await this.$app.$queryBus.exec(new LibraryFilesQuery());
      this.setFileId(this.libraryFiles[0]?.id || 0);
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    }
  }
}
