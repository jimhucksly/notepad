<template>
  <div class="notepad_item_file" ref="item_file_cont">
    <div class="file_icon">
      <i class="icon">
        <img :src="`../../static/file_types_icons/${itemFile.type}.svg`">
      </i>
    </div>
    <div class="file_link">
      <div>{{ itemFile.name }}</div>
      <div>
        <a :href="href" target="_blank">Открыть</a>
        <a :href="href" :data-filename="itemFile.name" download>Скачать</a>
      </div>                
    </div>
    <div>
      <div class="file_loader" ref="loader"><span></span></div>
    </div>
  </div>
</template>
<script>

  import $ from 'jquery'
  import { downloadFile } from '@/helpers'

  export default {
    name: 'File',
    props: ['itemKey', 'itemFile'],
    computed: {
      stamp() {
        return this.itemKey
      },
      href() {
        return this.itemFile.link
      }
    },
    mounted() {
      $(this.$refs.item_file_cont).on('click', 'a[href]', (e) => {
        e.preventDefault()
        if($(e.target).is('[download]')) {
          const loader = this.$refs.loader
          const fileName = this.itemFile.name
          const finalPath = this.$store.getters['getDownloadsTargetPath'] + '\\' + fileName
          downloadFile(this.href, finalPath, loader)
        } else {
          this.$electron.shell.openExternal(this.href)
        }
      })
    }
  }

</script>