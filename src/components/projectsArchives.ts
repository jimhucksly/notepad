import { Vue, Component, Prop } from 'vue-property-decorator'
import { now } from '~/helpers'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { IArchive, IJson } from '~/domain/models'
import { ArchiveRestoreCommand, ArchiveRemoveCommand } from '~/domain/commands'
import { Getter, Mutation } from 'vuex-class'
import { ArchivesQuery, ProjectsQuery } from '~/domain/queries'

@Component({
  name: 'ProjectsArchives'
})
export default class ProjectsArchives extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('projects/setArchives') setArchives: (value: Array<IArchive>) => void

  @Getter('projects/getArchives') items: IArchive[]
  @Getter('projects/getJson') json: IJson

  @Prop() expanded: boolean

  getDate(stamp: string): string {
    return now(stamp).date
  }

  async restore(o: IArchive) {
    try {
      const name = `${o.name}_(datetime)${o.date}`
      await this.commandBus.do<ArchiveRestoreCommand, string>(
        new ArchiveRestoreCommand(name)
      )
      this.queryBus.exec(new ArchivesQuery())
      this.queryBus.exec(new ProjectsQuery())
      this.$app.goBack()
    } catch(e) {
      console.log(e)
    }
  }

  async remove(o: IArchive) {
    try {
      const name = `${o.name}_(datetime)${o.date}`
      await this.commandBus.do<ArchiveRemoveCommand, void>(new ArchiveRemoveCommand(name))
      const arr = this.items.filter((e: IArchive) => {
        return e.name !== o.name
      })
      this.setArchives(arr)
    } catch(e) {
      console.log(e)
    }
  }
}
