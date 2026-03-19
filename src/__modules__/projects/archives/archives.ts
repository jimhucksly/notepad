import { Vue } from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { now } from '~/helpers';
import { IArchive, IProjects } from '../models';
import { ArchivesQuery, ProjectsQuery } from '../queries/queries';
import { ArchiveRemoveCommand, ArchiveRestoreCommand } from '../commands/commands';

export default class ProjectsArchives extends Vue {
  @Mutation('Projects/setArchives') setArchives: (value: Array<IArchive>) => void;

  @Getter('Projects/getArchives') items: IArchive[];
  @Getter('Projects/getProjects') json: IProjects;

  @Prop() expanded: boolean;

  @Emit('on-hide') emitHide() {
    return true;
  }

  getDate(stamp: string): string {
    return now(stamp).date;
  }

  async restore(o: IArchive) {
    try {
      await this.$app.$commandBus.do(new ArchiveRestoreCommand(o.id));
      this.$app.$queryBus.exec(new ArchivesQuery());
      this.$app.$queryBus.exec(new ProjectsQuery());
      this.emitHide();
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    }
  }

  async remove(o: IArchive) {
    try {
      await this.$app.$commandBus.do<ArchiveRemoveCommand, void>(new ArchiveRemoveCommand(o.id));
      const arr = this.items.filter((e: IArchive) => e.name !== o.name);
      this.setArchives(arr);
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    }
  }
}
