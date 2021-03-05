import { inject, injectable } from 'inversify'
import { ICommand } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'

export class NavigateCommand {
  constructor(public page: string) {}
}

@injectable()
export class NavigateCommandHandler implements ICommand<void> {
  interval: NodeJS.Timeout

  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  get isPreferences() {
    return this._store.getters.getIsPreferencesShow
  }
  get isProjects() {
    return this._store.getters.getIsProjectsShow
  }
  get isLibrary() {
    return this._store.getters.getIsLibraryShow
  }
  get isTodo() {
    return this._store.getters.getIsTodoShow
  }
  get isEvents() {
    return this._store.getters.getIsEventsShow
  }
  get isLinks() {
    return this._store.getters.getIsLinksShow
  }
  get isJsonViewer() {
    return this._store.getters.getIsJsonViewerShow
  }
  get pages() {
    return this._store.getters.getPages
  }

  get previousPage() {
    if(this.isPreferences) return 'preferences'
    if(this.isProjects) return 'projects'
    if(this.isLibrary) return 'library'
    if(this.isTodo) return 'todo'
    if(this.isEvents) return 'events'
    if(this.isLinks) return 'links'
    if(this.isJsonViewer) return 'jsonViewer'
    return ''
  }

  do<NavigateCommand>(command: NavigateCommand): void {
    try {
      const _command = (command as unknown) as Record<string, unknown>
      const page = _command.page
      if(page === 'goBack') {
        const previousPage = this._store.getters.getPreviousPage
        if(previousPage) {
          // preferences
          // projects
          // library
          // todo
          // events
          // links
          // jsonViewer
          this.pages.forEach((p: string) => {
            this._store.dispatch(p, p === previousPage)
          })
          this._store.commit('setPreviousPage', '')
        }
      } else {
        this._store.commit('setPreviousPage', this.previousPage)
        this.pages.forEach((p: string) => {
          this._store.dispatch(p, p === page)
        })
      }
    } catch(e) {
      console.log(e)
    }
  }
}
