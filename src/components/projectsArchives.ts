import { Vue, Component, Prop } from 'vue-property-decorator'
import { now } from '~/helpers'
import { ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { IArchive, IJson } from '~/domain/models'
import {
  SetJsonCommand,
  UpdateJsonCommand,
  ArchiveRestoreCommand,
  ArchiveRemoveCommand,
  SetArchivesCommand
} from '~/domain/commands'

@Component({
  name: 'ProjectsArchives'
})
export default class ProjectsArchives extends Vue {
  @Prop({ type: Boolean, default: false })
  init!: boolean

  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  get items(): IArchive[] {
    return this.$store.getters.getArchives
  }

  get json(): IJson {
    return this.$store.getters.getJson
  }

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
        await this.commandBus.do<UpdateJsonCommand, void>(new UpdateJsonCommand(json))
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
      this.commandBus.do<SetArchivesCommand, void>(new SetArchivesCommand(arr))
    } catch(e) {
      console.log(e)
    }
  }
}
