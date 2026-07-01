declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module '*.scss';
declare module '*.css';
declare module '@dn-web/ui/dist/scss';
