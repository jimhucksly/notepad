import { Options, Vue } from 'vue-class-component';

@Options({
  template: `
    <div class="b-splitter">
      <div class="b-splitter-left">
        <slot name="left-panel" />
      </div>
      <div class="b-separator" @mousedown="drag($event)">
        <template v-for="i in [1, 2, 3, 4, 5, 6, 7, 8]">
          <div class="items-center" :style="{ 'top': i === 1 ? '50%' : styleTop(i) }">
            <i style="width: 1px; height: 2px; background-color: var(--white)"></i>
            <i style="width: 1px; height: 2px;"></i>
            <i style="width: 1px; height: 2px; background-color: var(--white)"></i>
          </div>
        </template>
      </div>
      <div class="b-splitter-right">
        <slot name="right-panel" />
      </div>
    </div>
  `,
})
export default class BSplitterComponent extends Vue {
  mounted() {
    const container = this.$el;
    const left: HTMLElement | null = this.$el.querySelector('.b-splitter-left');
    const right: HTMLElement | null = this.$el.querySelector('.b-splitter-right');
    const separator: HTMLElement | null = this.$el.querySelector('.b-separator');
    if (container && left && right && separator) {
      separator.style.left = left.clientWidth + 'px';
    }
  }

  drag(event?: MouseEvent): void {
    const left: HTMLElement | null = this.$el.querySelector('.b-splitter-left');
    const right: HTMLElement | null = this.$el.querySelector('.b-splitter-right');
    const separator: HTMLElement | null = this.$el.querySelector('.b-separator');
    const container = this.$el;

    if (event.button !== 0) {
      return;
    }
    const startX = event.screenX;
    const minW = 17;

    if (container && left && right && separator) {
      const srcW = left.clientWidth;
      const resW = right.clientWidth;
      const contW = container.clientWidth;
      document.onmousemove = (e: MouseEvent) => {
        if (e.screenX < startX) {
          const w: number = srcW - (startX - e.screenX);
          const p: number = (w * 100) / contW;
          if (p > minW) {
            left.style.maxWidth = p + '%';
            left.style.minWidth = p + '%';
            separator.style.left = left.clientWidth + 'px';
            right.style.maxWidth = 100 - p + '%';
            right.style.minWidth = 100 - p + '%';
          }
        }
        if (e.screenX > startX) {
          const w: number = resW - (e.screenX - startX);
          const p = (w * 100) / contW;
          if (p > minW) {
            right.style.maxWidth = p + '%';
            right.style.minWidth = p + '%';
            left.style.maxWidth = 100 - p + '%';
            left.style.minWidth = 100 - p + '%';
            separator.style.left = left.clientWidth + 'px';
          }
        }

        left.classList.add('non-selectable');
        right.classList.add('non-selectable');
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        left.classList.remove('non-selectable');
        left.classList.remove('non-selectable');
      };
    }
  }

  styleTop(i: number) {
    return `calc(50% + 4px * ${i - 1})`;
  }
}
