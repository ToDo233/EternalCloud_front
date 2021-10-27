<template>
  <div class="header-wrapper">
    <div class="logo_text" @click="$router.push({ name: 'Home' })">Metes</div>
    <!-- <img class="logo" :src="logoUrl" @click="$router.push({ name: 'Home' })" /> -->
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        router
    >
      <!--      <el-menu-item index="Home" :route="{ name: 'Home' }" class="logo_text"><div class="logo_text">Metes</div></el-menu-item>-->
      <el-menu-item
          index="File"
          v-if="isLogin"
          :route="{ name: 'File', query: { fileType: 0, filePath: '/' } }"
      >Storage
      </el-menu-item>


      <div class="el-menu-item exit" @click="exitButton()" v-show="isLogin">
        Exit
      </div>
      <div class="el-menu-item username" v-show="isLogin">
        <i class="el-icon-user-solid"></i>{{ username }}
      </div>
      <el-menu-item
          class="login"
          index="Login"
          :route="{ name: 'Login' }"
          v-show="!isLogin"
      >Sign In
      </el-menu-item>

      <el-menu-item
          class="register"
          v-show="!isLogin"
          index="Register"
          :route="{ name: 'Register' }"
      >Sing Up
      </el-menu-item
      >
    </el-menu>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Header',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isLogin', 'username']),
    // 当前激活菜单的 index
    activeIndex() {
      return this.$route.name || 'Home' //  获取当前路由名称
    },

  },
  methods: {
    /**
     * 退出登录
     * @description 清除 cookie 存放的 token  并跳转到登录页面
     */
    exitButton() {
      this.removeCookies('token')
      // localStorage.removeItem('isLogin')
      // localStorage.removeItem('userInfoObj')
      this.$store.commit('changeIsLogin', '')
      this.$store.commit('changeUserInfoObj', {})
      this.$message.success('log out！')
      this.$router.push({path: '/login'})
      // this.$store.dispatch('getUserInfo').then(() => {
      //   this.removeCookies('token')
      //   this.$router.push({ path: '/login' })
      // })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'

.header-wrapper
  width: 100%
  padding: 0 20px
  //box-shadow: $tabBoxShadow
  display: flex
  background-color: #2196F3
  color white

  .logo_text
    text-align center
    line-height 61px
    width 200px

  .logo
    margin: 14px 24px 0 24px
    display: inline-block
    height: 40px
    cursor: pointer

    .el-menu--horizontal {
      border: none
    }

  >>> .el-menu

    .el-menu-item
      color white

    .el-menu-item:not(.is-disabled):hover
      color white
      border-bottom-color: white !important
      background: #2196F3

    .el-menu-item.is-active {
      background: #2196F3
      border-bottom-color: white !important
      color white
    }

    .external-link
      padding: 0

      a
        display: block
        padding: 0 20px

  .el-menu-demo
    flex: 1
    background-color: #2196F3
    border none

    .login, .register, .username, .exit
      float: right
      color white
</style>
