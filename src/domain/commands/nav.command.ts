import { inject, injectable } from 'inversify'
import { ICommand } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'

export class NavigateCommand {
  page = ''

  constructor(page: string) {
    this.page = page
  }
}

@injectable()
export class NavigateCommandHandler implements ICommand {
  interval: any

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
    if(this.isLinks) return 'links'
    if(this.isJsonViewer) return 'jsonViewer'
    return ''
  }

  do<TCommand>(command: TCommand) {
    const _command: any = {
      ...command
    }

    const page = _command.page
    if(page === 'goBack') {
      const previousPage = this._store.getters.getPreviousPage
      if(previousPage) {
        this.pages.forEach((p: string) => {
          this._store.dispatch(p, p === previousPage)
        })
        this._store.dispatch('previousPage', '')
      }
    } else {
      this._store.dispatch('previousPage', this.previousPage)
      this.pages.forEach((p: string) => {
        this._store.dispatch(p, p === page)
      })
    }
  }
}
