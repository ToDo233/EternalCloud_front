<template>
  <div class="login-wrapper" id="loginBackground">
    <div class="form-wrapper" v-loading="loading">
      <h1 class="login-title">Login</h1>
      <p class="login-system">Metes</p>
      <!-- 登录表单 -->
      <el-form
        class="login-form"
        ref="loginForm"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="100px"
        hide-required-asterisk
      >
        <el-form-item prop="userName">
          <el-input
            prefix-icon="el-icon-mobile-phone"
            v-model="loginForm.userName"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            placeholder="密码"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item class="login-btn-form-item">
          <el-button
            class="login-btn"
            type="primary"
            :disabled="loginBtnDisabled"
            @click="submitForm('loginForm')"
            >Login</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getToken, checkToken } from '@/request/user.js'
import Crypto from '../utils/crypto-m'
import SparkMD5 from 'spark-md5'


export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据
      loginForm: {
        userName: '',
        password: '',
      },
      // 登录表单验证规则
      loginFormRules: {
        userName: [
          { required: true, message: 'please input username', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'please input password', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: ' should be 5 to 16 characters',
            trigger: 'blur',
          },
        ],
      },
      isPassing: true,
      loginBtnDisabled: false,
      MasterKey_af: '',
      loading: false,
    }
  },
  computed: {
    url() {
      let _url = this.$route.query.Rurl //  获取路由前置守卫中 next 函数的参数，即登录后要去的页面
      return _url
        ? { path: _url }
        : { name: 'File', query: { fileType: 0, filePath: '/' } } //  若登录之前有页面，则登录后仍然进入该页面
    },
  },
  watch: {

  },
  created() {
    // 用户若已登录，自动跳转到首页
    if (this.$store.getters.isLogin) {
      let username = this.$store.getters.username
      this.$message({
         message: `${username} welcome back`,
        center: true,
        type: 'success',
      })
      this.$router.replace({ name: 'Home' })
    }

  },
  methods: {

    /**
     * 登录按钮点击事件 表单验证&用户登录
     * @param {boolean} formName 表单ref值
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          // 表单各项校验通过
          // 表单各项校验通过
          let keykey = this.loginForm.password
          const trustForm = {
            userName: this.loginForm.userName,
          }
          getToken(trustForm).then((res) => {
            if (res.code == 200) {
              // TODOS：md5 16位
              keykey = SparkMD5.hash(keykey);
              // 1 使用密码解密masterkey
              let MasterKey_af = Crypto.decryptAes(keykey, res.data.masterKeyBa)
              console.log(MasterKey_af);
              // 解密不出来说明密码错误
              if (!MasterKey_af) {
                this.$message.error('密码错误，请重试')
                this.isPassing = false
                this.$refs.dragVerifyRef.reset()
                this.loading = false
                return
              }
               console.log('解密出 MasterKey '+ MasterKey_af)
              this.MasterKey_af = MasterKey_af

              //  let rsa_private_key = Crypto.decryptAes(MasterKey_af , rsa_private_key_ba)
              // 2 使用masterkey解密出RSA私钥
              let rsa_private_key = Crypto.decryptAes(
                MasterKey_af,
                res.data.privateKeyBa
              )
              console.log('解密出 rsa_private_key '+ rsa_private_key)

              let token_ba = res.data.token
              // let tokens = token_ba.split('==')
              // console.log(tokens)
              let trust_token = ''
              // for (let index = 0; index < tokens.length - 1; index++) {
              //   let element = tokens[index]
                //console.log(element)
                // 3 使用RSA私钥解密出token
                trust_token += Crypto.decryptRsa(
                  rsa_private_key,
                  token_ba + '=='
                )
              // }
              //console.log('解密出token：'+ trust_token)
              // this.ttoken = trust_token
              let check = {
                token: trust_token,
              }
              console.log(trust_token);
              this.setCookies('token', trust_token) //  存储登录状态
              checkToken().then((res) => {
                if (res.checkResult) {
                  //this.$store.state.user.mk = this.MasterKey_af
                  localStorage.setItem('mk', this.MasterKey_af)
                  this.$store.commit('changeIsLogin', true)
                  this.$store.commit('changeUserInfoObj', {
                    username: this.loginForm.userName,
                  })
                  this.$router.replace(this.url) //  跳转到前一个页面或者网盘主页


                  this.$refs[formName].resetFields() //  清空表单
                }
                this.loading = false
              })
            } else {
              this.loading = false
              this.$message.error(res.message)
              this.isPassing = false
              this.$refs.dragVerifyRef.reset()
            }
          })
          // login(this.loginForm, true).then((res) => {
          //   if (res.success) {
          //     this.setCookies('token', res.data.token) //  存储登录状态
          //     this.$refs[formName].resetFields() //  清空表单
          //     this.$router.replace(this.url) //  跳转到前一个页面或者网盘主页
          //   } else {
          //     this.$message.error('手机号或密码错误！')
          //     this.isPassing = false
          //     this.$refs.dragVerifyRef.reset()
          //   }
          // })
        } else {
          this.$message.error('请填写相关信息！')
          return false
        }
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.login-wrapper
  // height: 550px !important;

  min-height: calc(100vh - 189px) !important
  padding-top: 50px
  .form-wrapper
    width: 375px
    margin: 0 auto
    text-align: center
    .login-title
      margin-bottom: 10px
      font-weight: 300
      font-size: 30px
      color: #000
    .login-system
      font-weight: 300
      color: #999
    .login-form
      width: 100%
      margin-top: 20px
      >>> .el-form-item__content
        margin-left: 0 !important
      &>>> .el-input__inner
        font-size: 16px
      .login-btn-form-item
        .login-btn
          width: 100%
        &>>> .el-button
          padding: 10px 90px
          font-size: 16px
    .tip
      width: 70%
      margin-left: 86px
</style>
