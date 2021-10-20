import { Options, Vue } from 'vue-class-component'

@Options({
  template: `
    <div id="loading_cont">
      <div class="m-b-5">
        <small>Connection...</small>
      </div>
      <div class="loading"></div>
    </div>
  `
})
export default class Loading extends Vue {
  //
}
