import { Vue } from 'vue-class-component'

export default class PostmanPage extends Vue {
  send() {
    const xhr = new XMLHttpRequest()
    const url = ['http://localhost', Number($PORT) + 1].join(':')
    xhr.open('POST', `${url}/postman`, true)
    xhr.send(JSON.stringify({ foo: 'bar' }))
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) {
        // alert(xhr.status + ': ' + xhr.statusText)
      } else {
        /* eslint-disable no-console */
        console.log(xhr.responseText)
      }
    }
  }
}
