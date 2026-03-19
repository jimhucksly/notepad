import { Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { IUser } from '~/domain/models';

export default class Account extends Vue {
  @Getter('getCurrentUser') currentUser: IUser;

  logout() {
    this.$app.logout();
  }

  cancel() {
    this.$app.goBack();
  }
}
