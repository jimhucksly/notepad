import { eventBus } from '@dn-web/core';
import { Vue } from 'vue-class-component';

export default class UploadComponent extends Vue {
  percentage = 0;

  created() {
    eventBus.$on('upload-progress', this.onProgress);
  }

  beforeUnmount() {
    eventBus.$off('upload-progress', this.onProgress);
  }

  onProgress(progress: { loaded: number; total: number }) {
    this.percentage = Math.ceil((progress.loaded * 100) / progress.total);
  }

  onComplete() {
    setTimeout(() => {
      this.$emit('cancel');
    }, 500);
  }
}
