import { Options, Vue } from 'vue-class-component'
import { Hub } from '~/plugins/hub'

@Options({
  template: `
    <div class="json_viewer">
      <button @click="open">
        <svg-icon icon="btnOpen" width="32" height="23" />
      </button>
      <button @click="save">
        <svg-icon icon="btnSave" width="32" height="23" />
      </button>
      <button @click="clear" class="m-l-35">
        <svg-icon icon="btnClear" width="32" height="23" />
      </button>
    </div>
  `
})
export default class JsonViewerBtns extends Vue {
  open() {
    const openFile = () => {
      const element = document.createElement('input')
      element.type = 'file'
      element.accept = '.txt, .json'
      element.onchange = function() {
        readText(this as HTMLInputElement)
        document.body.removeChild(element)
      }

      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
    }

    const readText = (filePath: HTMLInputElement) => {
      let reader = null
      if(window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader()
      } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.')
        return false
      }
      let output = ''
      if(filePath.files && filePath.files[0]) {
        reader.onload = (e: ProgressEvent<FileReader>) => {
          output = e.target.result as string
          Hub.$emit('json-viewer-set', output)
        }
        reader.readAsText(filePath.files[0])
      } else return false
      return true
    }

    openFile()
  }

  save() {
    this.$electron.ipcRenderer.send('save-file-dialog', {})
    this.$electron.ipcRenderer.on(
      'save-dialog-file-selected',
      (e: Electron.IpcRendererEvent, file: { filePath: string }) => {
        if(file && file.filePath) {
          Hub.$emit('json-viewer-save', file.filePath)
        }
      }
    )
  }

  clear() {
    Hub.$emit('json-viewer-clear')
  }
}
