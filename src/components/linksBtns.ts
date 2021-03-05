import { Vue, Component } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
import BtnAdd from '~/components/btnAdd'

@Component({
  name: 'LinksBtns',
  components: {
    BtnAdd
  }
})
export default class LinksBtns extends Vue {
  @Mutation('setIsLinkAddPopupShow') showAddLinkPopup: (value: boolean) => void

  add() {
    this.showAddLinkPopup(true)
  }
}
