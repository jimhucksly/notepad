<template>
  <div>
    <titlebar></titlebar>
    <main>

    </main>
  </div>
</template>
<script>

  import Titlebar from './titlebar'

  export default {
    name: 'Index',
    components: {
      Titlebar
    },
    mounted() {
      this.$http.get('GET_JSON')
        .then(resp => {
          // console.log(resp)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>