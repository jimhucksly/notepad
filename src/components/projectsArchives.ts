import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ArchiveRemoveCommand, ArchiveRestoreCommand } from '~/domain/commands'
import { IArchive, IProjects } from '~/domain/models'
import { ArchivesQuery, ProjectsQuery } from '~/domain/queries'
import { now } from '~/helpers'

export default class ProjectsArchives extends Vue {
  @Mutation('projects/setArchives') setArchives: (value: Array<IArchive>) => void

  @Getter('projects/getArchives') items: IArchive[]
  @Getter('projects/getProjects') json: IProjects

  @Prop() expanded: boolean

  getDate(stamp: string): string {
    return now(stamp).date
  }

  async restore(o: IArchive) {
    try {
      const name = `${o.name}_(datetime)${o.date}`
      await this.$app.$commandBus.do<ArchiveRestoreCommand, string>(
        new ArchiveRestoreCommand(name)
      )
      this.$app.$queryBus.exec(new ArchivesQuery())
      this.$app.$queryBus.exec(new ProjectsQuery())
      this.$app.goBack()
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  async remove(o: IArchive) {
    try {
      const name = `${o.name}_(datetime)${o.date}`
      await this.$app.$commandBus.do<ArchiveRemoveCommand, void>(new ArchiveRemoveCommand(name))
      const arr = this.items.filter((e: IArchive) => {
        return e.name !== o.name
      })
      this.setArchives(arr)
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }
}
