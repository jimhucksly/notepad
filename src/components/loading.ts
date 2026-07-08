import { Options, Vue } from 'vue-class-component';

@Options({
  template: `
    <div id="loading_cont">
      <svg width="60" height="60" viewBox="0 0 50 50">
        <g transform="translate(25,25)">
            <g transform="rotate(0)">
              <circle cx="12" cy="0" r="3" fill="var(--primary)">
              <animate attributeName="r" values="3;4;3" dur="1s" repeatCount="indefinite" begin="0s"/>
              </circle>
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite"/>
            </g>
            <g transform="rotate(120)">
              <circle cx="12" cy="0" r="3" fill="var(--primary)">
              <animate attributeName="r" values="3;4;3" dur="1s" repeatCount="indefinite" begin="0.3s"/>
              </circle>
              <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="2s" repeatCount="indefinite"/>
            </g>
            <g transform="rotate(240)">
              <circle cx="12" cy="0" r="3" fill="var(--primary)">
              <animate attributeName="r" values="3;4;3" dur="1s" repeatCount="indefinite" begin="0.6s"/>
              </circle>
              <animateTransform attributeName="transform" type="rotate" from="240" to="600" dur="2s" repeatCount="indefinite"/>
            </g>
        </g>
      </svg>
    </div>
  `,
})
export default class Loading extends Vue {
  //
}
