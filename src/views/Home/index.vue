<template>
  <div class="home-swapper">
    <Banner></Banner>
  </div>
</template>

<script>
import Banner from './components/Banner.vue'


export default {
  name: 'Home',
  components: {
    Banner
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.home-swapper {
  width: 100% !important;
  flex-direction column
}
</style>
