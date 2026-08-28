import { eventBus } from '@dn-web/core';
import { debounce } from 'lodash';
import { Options, Vue } from 'vue-class-component';
import { Libs, Types } from '~/core';

/* eslint-disable @typescript-eslint/no-require-imports */
require('brace/mode/javascript');
require('brace/theme/twilight');

const JSONFormatter = require('json-formatter-js');

const fs = require('fs');

@Options({
  components: {
    editor: Libs.Editor,
  },
  beforeUnmount() {
    eventBus.$off('json-viewer-src-set', this.onJsonHandler);
    eventBus.$off('json-viewer-save', this.onJsonSaveHandler);
    eventBus.$off('json-viewer-clear', this.onJsonClearHandler);
  },
})
export default class JsonViewer extends Vue {
  editor: Types.IEditor = null;
  content = '';
  formatted = false;

  debounced: () => void = null;

  onJsonHandler: (value: string) => void;
  onJsonSaveHandler: (fileName: string) => void;
  onJsonClearHandler: () => void;

  editorInit(instance: Types.IEditor) {
    this.debounced = debounce(() => {
      this.format(instance);
    }, 3000);
    instance.on('change', this.debounced);
    this.editor = instance;
  }

  format(instance: Types.IEditor) {
    const res: HTMLElement | null = document.querySelector('.json_viewer_res');
    if (this.formatted) {
      this.formatted = false;
      return;
    }
    const value = instance.getValue();
    if (!value.length) {
      if (res) {
        res.innerHTML = '';
      }
      return;
    }
    let json: Record<string, unknown> = null;
    try {
      json = JSON.parse(value);
      setTimeout(() => {
        this.formatted = true;
        const text = JSON.stringify(json, null, 2);
        this.editor.setValue(text);
      }, 100);
      if (window.localStorage) {
        localStorage.setItem('json_viewer', JSON.stringify(json));
      }
    } catch (e) {
      this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed');
      if (res) {
        res.innerHTML = '';
      }
    }
    const formatter = new JSONFormatter(json);
    if (res) {
      res.innerHTML = '';
      const html = formatter.render();
      res.appendChild(html);
    }
    formatter.openAtDepth(1);
    this.notice('Json parse successed!');
  }

  notice(text: string) {
    const notice: HTMLElement = document.querySelector('.json_viewer_notice');
    if (notice) {
      notice.innerText = text;
      notice.style.display = 'flex';
      setTimeout(() => {
        notice.style.display = 'none';
      }, 3000);
    }
  }

  onJson(value: string) {
    let json: Record<string, unknown> = null;
    try {
      json = JSON.parse(value);
      this.editor.setValue(JSON.stringify(json, null, 2));
    } catch (e) {
      this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed');
    }
  }

  onJsonSave(fileName: string) {
    fs.writeFileSync(fileName, this.editor.getValue(), 'utf-8');
    this.notice('Json saved succesfully!');
  }

  onJsonClear() {
    this.editor.setValue('');
    const res: HTMLElement = document.querySelector('.json_viewer_res');
    if (res) {
      res.innerHTML = '';
    }
    if (window.localStorage) {
      localStorage.removeItem('json_viewer');
    }
  }

  mounted() {
    this.onJsonHandler = this.onJson.bind(this);
    eventBus.$on('json-viewer-set', this.onJsonHandler);
    this.onJsonSaveHandler = this.onJsonSave.bind(this);
    eventBus.$on('json-viewer-save', this.onJsonSaveHandler);
    this.onJsonClearHandler = this.onJsonClear.bind(this);
    eventBus.$on('json-viewer-clear', this.onJsonClearHandler);
    if (window.localStorage) {
      const value = localStorage.getItem('json_viewer');
      let json: Record<string, unknown> = null;
      if (value) {
        try {
          json = JSON.parse(value);
          this.editor.setValue(JSON.stringify(json, null, 2));
        } catch (e) {
          /* eslint-disable no-console */
          console.error(e);
        }
      }
    }
  }
}
