import { Vue, Component, Prop } from 'vue-property-decorator'
import { now } from '~/helpers'
import { ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { IArchive, IJson } from '~/domain/models'
import {
  SetJsonCommand,
  ArchiveRestoreCommand,
  ArchiveRemoveCommand,
  CreateProjectCommand
} from '~/domain/commands'
import { Getter, Mutation } from 'vuex-class'

@Component({
  name: 'ProjectsArchives'
})
export default class ProjectsArchives extends Vue {
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setArchives') setArchives: (value: Array<IArchive>) => void

  @Getter('getArchives') items: IArchive[]
  @Getter('getJson') json: IJson

  @Prop() expanded: boolean

  getDate(stamp: string): string {
    return now(stamp).date
  }

  async restore(o: IArchive) {
    try {
      const name = `${o.name}_(datetime)${o.date}`
      const html: string = await this.commandBus.do<ArchiveRestoreCommand, string>(
        new ArchiveRestoreCommand(name)
      )
      if(html) {
        const { date, stamp } = now()
        const json: IJson = {
          [stamp]: {
            key: stamp,
            date,
            name: o.name,
            lock: false,
            message: html
          }
        }
        this.commandBus.do<SetJsonCommand, void>(new SetJsonCommand({ ...this.json, ...json }))
        await this.commandBus.do<CreateProjectCommand, void>(new CreateProjectCommand(json))
        this.remove(o)
      }
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
