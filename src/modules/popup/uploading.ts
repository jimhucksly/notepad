import { Options, Vue } from 'vue-class-component'

@Options({
  template: `
    <div id="upload-download-popup">
      <div class="label">
        <span>Uploading file...</span>
        <span class="percentage" ref="text"></span>
      </div>
      <div class="progress" ref="progress"></div>
    </div>
  `
})
export default class UploadingPopup extends Vue {
  //
}
