import { animate } from 'animejs';
import { App } from 'vue';

export default {
  install: (vue: App) => {
    const slideDown = (el: HTMLElement, duration = 300) => {
      el.style.overflow = 'hidden';
      el.style.display = 'block';
      const h = el.clientHeight;
      el.style.visibility = 'hidden';
      el.style.height = '0px';
      el.style.visibility = 'visible';
      animate(el, {
        height: h,
        easing: 'linear',
        duration,
        onComplete() {
          el.attributes.removeNamedItem('style');
        },
      });
    };

    const slideUp = (el: HTMLElement, duration = 300) => {
      el.style.overflow = 'hidden';
      animate(el, {
        height: 0,
        easing: 'linear',
        duration,
        onComplete() {
          el.attributes.removeNamedItem('style');
          el.style.display = 'none';
        },
      });
    };

    vue.config.globalProperties.$slideDown = slideDown;
    vue.config.globalProperties.$slideUp = slideUp;
  },
};
