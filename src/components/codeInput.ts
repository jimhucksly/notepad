import { Options, Prop, Vue, Watch } from 'vue-property-decorator';

@Options({
  template: `
    <div class="code-fields">
      <template v-for="i in arr">
        <input
          type="text"
          :id="'field-' + i"
          v-model="values[i]"
          @input="onInput($event, i)"
          @keydown="onKeydown($event, i)"
          :class="{ error }"
        >
      </template>
    </div>
  `,
})
export default class CodeInput extends Vue {
  @Prop() modelValue: string;
  @Prop() count: number;
  @Prop() error: boolean;

  values: Record<number, unknown> = {};
  isError = false;

  @Watch('values', { deep: true }) onValuesChanged() {
    const code = Object.values(this.values).join('');
    if (code) {
      this.$emit('update:modelValue', code);
    }
  }

  onInput(e: KeyboardEvent, index: number) {
    const value = (e.target as HTMLInputElement).value.trim();
    if (/\D/.test(value)) {
      this.values[index] = value.replace(/\D/g, '');
      return false;
    }
    if (index === 1 && value.length > 1 && /^\d+$/.test(value)) {
      this.values[index] = value.slice(0, 1);
      for (let i = 2; i <= value.length; i++) {
        this.setFocus(index + i - 1, value.slice(i - 1, i));
      }
      return false;
    }
    if (value.length === 1 && /\d/.test(value)) {
      this.values[index] = value;
      this.setFocus(index + 1);
    } else {
      this.values[index] = value.slice(0, 1);
      this.setFocus(index + 1, value.slice(1));
    }
  }

  onKeydown(e: KeyboardEvent, index: number) {
    if (e.code === 'Delete') {
      e.preventDefault();
      e.stopPropagation();
      this.values[index] = '';
    }
    if (e.code === 'Backspace') {
      e.preventDefault();
      e.stopPropagation();
      this.values[index] = '';
      this.setFocus(index - 1);
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      this.setFocus(index - 1);
    }
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      this.setFocus(index + 1);
    }
    return false;
  }

  setFocus(index: number, value?: string) {
    const input = this.$el.querySelector('#field-' + index);
    if (input) {
      input.focus();
      if (value) {
        this.values[index] = value;
      }
    }
  }

  get arr(): Array<number> {
    return Array(this.count)
      .fill(1)
      .map((_, i) => i + 1);
  }
}
