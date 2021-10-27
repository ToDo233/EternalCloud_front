<template>
  <div class="register-wrapper" id="registerBackground">
    <div class="form-wrapper">
      <h1 class="register-title">Sign Up</h1>
      <p class="register-system">Metes</p>
      <!-- 注册表单 -->
      <el-form
        class="register-form"
        ref="registerForm"
        :model="registerForm"
        :rules="registerFormRules"
        label-width="100px"
        hide-required-asterisk
      >
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="registerForm.username"
            placeholder="userName"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="telephone">
          <el-input prefix-icon="el-icon-mobile-phone" v-model="registerForm.telephone"
            placeholder="手机号"></el-input>
        </el-form-item> -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="registerForm.password"
            placeholder="passWord"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item class="registerButtonWrapper">
          <el-button
            class="registerButton"
            type="primary"
            :disabled="submitDisabled"
            @click="submitForm('registerForm')"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { addUser } from '@/request/user.js'
import Crypto from '../utils/crypto-m'
import SparkMD5 from 'spark-md5'

export default {
  name: 'Register',

  data() {
    return {
      // 注册表单
      registerForm: {
        // telephone: '',
        username: '',
        password: '',
      },
      // 注册表单校验规则
      registerFormRules: {
        username: [
          { required: true, message: 'please input username', trigger: 'blur' },
        ],
        password: [
          { required: true, message: 'please input password', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: 'should be 5 to 16 characters',
            trigger: 'blur',
          },
        ],
        // telephone: [
        //   { required: true, message: '请输入手机号', trigger: 'blur' },
        //   { min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' },
        // ],
      },
      isPassing: true, //  滑动解锁是否验证通过
      submitDisabled: false, //  登录按钮是否禁用
    }
  },
  computed: {
    url() {
      let _url = this.$route.query.Rurl //  获取路由前置守卫中 next 函数的参数，即登录后要去的页面
      return _url ? _url : '/' //  若登录之前有页面，则登录后仍然进入该页面
    },
  },
  watch: {

  },
  created() {

  },
  methods: {

    /**
     * 注册按钮点击事件 表单验证&用户注册
     * @param {boolean} formName 表单ref值
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 表单各项校验通过
          // 表单各项校验通过
          // 1 获取masterkey
          const master_key = Crypto.masterKey()
          console.log('master_key：' + master_key)
          let ps = this.registerForm.password
          // TODOS:改成md5 16位
            ps = SparkMD5.hash(ps);
          console.log('password：' + ps)
          this.registerForm.password = ps
          // 2 使用用户密码 加密masterkey
          this.registerForm.masterKeyBa = Crypto.encryptAes(
            this.registerForm.password,
            master_key
          )
          // console.log('masterKeyBa:' + this.registerForm.masterKeyBa)
          // console.log(Crypto.decryptAes(this.registerForm.password ,this.registerForm.masterKeyBa))
          // console.log( this.registerForm.masterKeyBa);
          // 3 生成 RSA 对
          const key = Crypto.getRsaKey()
          // 4 使用 MasterKey 加密 RSA 私钥
          this.registerForm.privateKeyBa = Crypto.encryptAes(
            master_key,
            key.privateKey
          )
          // console.log('privateKeyBa' + this.registerForm.privateKeyBa)
          // 5 获取RSA公钥
          this.registerForm.publicKey = key.publicKey
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
            .trim()
          // console.log('publicKey' + this.registerForm.publicKey)
          addUser({
            userName: this.registerForm.username,
            privateKeyBa: this.registerForm.privateKeyBa,
            publicKey: this.registerForm.publicKey,
            masterKeyBa: this.registerForm.masterKeyBa,
          }).then((res) => {
            if (res.code == 200) {
              this.$notify({
                title: '成功',
                message: '注册成功！已跳转到登录页面',
                type: 'success',
              })
              this.$refs[formName].resetFields()
              this.$router.replace({ path: '/login' })
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error('请完善信息！')
          return false
        }
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.register-wrapper
  // height: 500px !important;
  min-height: calc(100vh - 189px) !important
  width: 100% !important
  padding-top: 50px
  .form-wrapper
    width: 375px
    margin: 0 auto
    text-align: center
    .register-title
      margin-bottom: 10px
      font-weight: 300
      font-size: 30px
      color: #000
    .register-system
      font-weight: 300
      color: #999
    .register-form
      width: 100%
      margin-top: 20px
      >>> .el-form-item__content
        margin-left: 0 !important
      &>>> .el-input__inner
        font-size: 16px
      .registerButtonWrapper
        .registerButton
          width: 100%
        &>>> .el-button
          padding: 10px 90px
          font-size: 16px
    .tip
      width: 70%
      margin-left: 86px
</style>
