<template>
  <div class="footer-wrapper">
    <div class="copy-right-wrapper">
      <div class="copy-right">
        <span>Metes </span>
        <span class="split">|</span>
        <p class="tip-website">
          <!--          为获得最佳浏览体验，建议使用IE11、FireFox50.5、Chrome51.0及以上版本的浏览器-->
        </p>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {}
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.footer-wrapper
  //margin-top: 20px
  display: flex

  .copy-right-wrapper
    width: 100%
    color: $BorderLight
    background: linear-gradient(to right, $Primary, #66b1ff)
    padding: 16px 0 16px 5vw
    font-size: 14px
    color: $BorderLight
    display: flex
    align-items: center

    .logo
      width: 240px
      display: block

    .split
      margin: 0 8px

    .link
      &:hover
        text-decoration: underline

    .tip-website
      padding-top: 8px

  .join-us
    background: linear-gradient(to right, $Placeholder, $Info)
    width: 35%
    padding: 16px 5vw 16px 40px
    color: #fff

    .join-list
      margin-top: 16px
      display: flex

      .join-item
        .iconfont
          margin-right: 16px
          font-size: 30px
          cursor: pointer

        .qq
          &:hover
            color: $Primary

        .wechat
          &:hover
            color: $Success

        .gitee
          &:hover
            color: #c71d24
</style>
