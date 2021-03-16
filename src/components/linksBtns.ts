import { Vue, Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

@Component({
  name: 'LinksBtns'
})
export default class LinksBtns extends Vue {
  @Mutation('setIsLinkAddPopupShow') showAddLinkPopup: (value: boolean) => void

  add() {
    this.showAddLinkPopup(true)
  }
}
