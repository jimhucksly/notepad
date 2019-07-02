<template>
  <div>
    notepad
  </div>
</template>
<script>

  import { mapGetters } from 'vuex'

  export default {
    name: 'Notepad',
    computed: {
      ...mapGetters({
        json: 'getJson'
      })
    }
  }

</script>

