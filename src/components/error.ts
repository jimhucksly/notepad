import { Options, Vue } from 'vue-class-component';

@Options({
  template: `
    <div class="error_cont">
      <div class="error_cont_inner">
        Connection is lost.
      </div>
    </div>
  `,
})
export default class Error extends Vue {
  //
}
