<template>
  <aside>
    <legend>Projects</legend>
    <div class="projects">
      <div class="projects_item"
        v-for="item in json" 
        :data-stamp="item.key" 
        ref="projects_item"
        @click.prevent="triggerfilter($event, item.key)">
        <label>{{ item.name || item.key }}</label>
        <input type="text" v-model="names[item.key]" @keydown.enter="triggerEdit($event, item.key)">
        <span class="projects_item_icon" @click="triggerEdit($event, item.key)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" version="1.1">
            <g class="g1" style="fill: #FFE66A">
              <path style=" " d="M 20.09375 0.25 C 19.5 0.246094 18.917969 0.457031 18.46875 0.90625 L 17.46875 1.9375 L 24.0625 8.5625 L 25.0625 7.53125 C 25.964844 6.628906 25.972656 5.164063 25.0625 4.25 L 21.75 0.9375 C 21.292969 0.480469 20.6875 0.253906 20.09375 0.25 Z M 16.34375 2.84375 L 14.78125 4.34375 L 21.65625 11.21875 L 23.25 9.75 Z M 13.78125 5.4375 L 2.96875 16.15625 C 2.71875 16.285156 2.539063 16.511719 2.46875 16.78125 L 0.15625 24.625 C 0.0507813 24.96875 0.144531 25.347656 0.398438 25.601563 C 0.652344 25.855469 1.03125 25.949219 1.375 25.84375 L 9.21875 23.53125 C 9.582031 23.476563 9.882813 23.222656 10 22.875 L 20.65625 12.3125 L 19.1875 10.84375 L 8.25 21.8125 L 3.84375 23.09375 L 2.90625 22.15625 L 4.25 17.5625 L 15.09375 6.75 Z M 16.15625 7.84375 L 5.1875 18.84375 L 6.78125 19.1875 L 7 20.65625 L 18 9.6875 Z "/>
            </g>
          </svg>
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 
            viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
            <g style="fill: #FFE66A">
              <path d="M26,0h-2v13H8V0H0v32h32V6L26,0z M28,30H4V16h24V30z"/>
              <rect x="6" y="18" width="20" height="2"/>
              <rect x="6" y="22" width="20" height="2"/>
              <rect x="6" y="26" width="20" height="2"/>
              <rect x="18" y="2" width="4" height="9"/>
            </g>
          </svg>
        </span>
      </div>
    </div>
  </aside>
</template>
<script>

  import { mapGetters } from 'vuex'
  import { cloneDeep, unset } from 'lodash'

  export default {
    name: 'Sudebar',
    data() {
      return {
        names: {}
      }
    },
    computed: {
      ...mapGetters({
        json: 'getJson',
        filter: 'getFilter'
      })
    },
    methods: {
      triggerEdit(e, stamp) {
        const item = this.$refs.projects_item.find(item => item.dataset.stamp === stamp)
        if(item.classList.contains('edit')) {
          item.classList.remove('edit')
          this.$store.dispatch('json', Object.assign({}, this.json, {
            [stamp]: {
              key: stamp,
              date: this.json[stamp]['date'],
              name: this.names[stamp],
              message: this.json[stamp]['message'],
              file: this.json[stamp]['file']
            }
          }))
          this.$nextTick(() => {
            this.$store.dispatch('action', {
              type: 'SEND'
            })
          })
        } else {
          item.classList.add('edit')
          this.names = Object.assign({}, this.names, {
            [stamp]: this.json[stamp]['name'] || this.json[stamp]['key']
          })
        }
      },
      triggerfilter(e, stamp) {
        const item = this.$refs.projects_item.find(item => item.dataset.stamp === stamp)
        if(e.target.tagName === 'DIV' || e.target.tagName === 'LABEL') {
          if(item.classList.contains('active')) {
            item.classList.remove('active')
            const buff = cloneDeep(this.filter)
            unset(buff, stamp)
            this.$store.dispatch('filter', Object.assign({}, buff))
          } else {
            item.classList.add('active')
            this.$store.dispatch('filter', Object.assign({}, this.filter, {
              [stamp]: true
            }))
          }
        }
      }
    }
  }

</script>

