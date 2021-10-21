<template>
  <div class="section no-pad-bot" id="index-banner">
    <div class="container">
     <div class="message"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Banner',
  data() {
    return {

    }
  },
  methods: {
    goFile() {
      this.$router.push({ name: 'File', query: { filePath: '/', fileType: 0 } })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/css/materialize.css'
#index-banner {
  min-height: 632px;
  max-height: 864px;
  position: relative;
  background-color: #2196F3;
}
.message {
  position: absolute;
  top: 40%;
  left: 30%;
  width: 50ch;
  transform: translate(-50%, -50%);
  color white
}
.message:before,

.message:after {
  display: block;
  overflow: hidden;
  width: 0;
  font-size 48pt
  white-space: nowrap;
  animation: a1 7.6s steps(38) forwards;
  content: "My Eternal EncryptS toreage,";
}

.message:after {
  animation: a2 6.4s steps(38) 7.6s forwards;
  content: "just Metes.me.";
}
@keyframes a1 {
  to {
    width: 70ch;
  }
}
@keyframes a2 {
  to {
    width: 70ch;
  }
}
</style>
