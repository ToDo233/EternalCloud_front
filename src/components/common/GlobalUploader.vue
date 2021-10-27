<template>
  <div class="global-uploader">
    <!-- 上传文件组件 -->
    <el-dialog
        title="upload"
        :visible.sync="open"
        width="400px"
        append-to-body
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
      <el-upload
          class="uploader-app"
          ref="uploader"
          :action="options.target"
          :headers="options.headers"
          :on-change="handleFileAdded"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :on-progress="handleFileProcess"
          :auto-upload="false"
          :file-list="uploadFileList"
          drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">

          <em>click to Select File</em>
        </div>
        <!-- <el-button size="mini" type="primary" ref="uploadBtn">加密上传</el-button> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">submit</el-button>
        <el-button @click="close">close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import FileCrypto from '@/utils/crypto-f.js'
import Crypto from '@/utils/crypto-m.js'
import {pinByHash} from '@/request/file.js'

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    uploadData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      uploadFileList: [],
      isUploading: false,
      percentage: 0,
      // 上传组件配置项
      options: {
        target: '', // 上传文件-目标 URL
        headers: {
          Authorization: '',
        },
        // target: 'https://ipfs-gw.decloud.foundation/api/v0/add', // 上传文件-目标 URL
        // headers: {
        //   Authorization:
        //     'Basic c3Vic3RyYXRlLWNUR3dEbjZ2aW9lNHFzSmNNSzFBSkh1d2FEeXJtZTg2ZWZTUVZ4NGZoM0JKWmdEc0Q6MHg1Y2YyM2EwYTc2ODM4NjYyNTkyNTBkYjk4ODgxZmNiZWM2YjFlMjA1M2IwODc5NzZlY2VkY2VlYmJmNmI3YjAwZWQxYWU2MTU4YzNiNTBmOTRiYThkNmY4MGFiOGE3N2ZhNDJmMTUxYjE1YmE2ZThhOWJlMGFlOTA2MDdiNmE4Zg====',
        // },
      },
      // 文件状态文案映射
      fileStatusText: {
        success: '上传成功',
        error: 'error',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中',
      },
      attrs: {
        accept: '*',
      },
      panelShow: false, //  上传文件面板是否显示
      collapse: false, //	上传文件面板是否折叠
      dropBoxShow: false, //  拖拽上传是否显示
      // 粘贴图片的信息
      pasteImg: {
        src: '',
        name: '',
      },
      pasteImgObj: null, //  粘贴图片 File 对象
      isEncrypto: false,
      fileKey: null,
    }
  },
  computed: {
    // Uploader	上传组件实例
    uploaderInstance() {
      return this.$refs.uploader.uploader
    },
    // 剩余存储空间
    remainderStorageValue() {
      return this.$store.getters.remainderStorageValue
    },
  },
  mounted() {
    this.$EventBus.$on('openUploader', (query, type, isEncrypto) => {
      this.isEncrypto = isEncrypto
      this.options.headers.token = this.getCookies('token')
      this.params = query || {}
      if (type) {
        // console.log(this.$refs.uploadBtn.$el);
        this.$refs.uploadBtn.$el.click()
      } else {
        this.pasteImg.src = ''
        this.pasteImg.name = ''
        this.pasteImgObj = null
        this.dropBoxShow = true
      }
    })
  },
  destroyed() {
    this.$off('openUploader')
  },
  methods: {


    handleFileProcess(event, file, fileList) {
      console.log(file)
    },
    submitFileForm() {
      this.$refs.uploader.submit()
    },
    close() {
      this.$emit('closeUploadDialog')
    },
    // 图片粘贴事件
    handlePaste(event) {
      let pasteItems = (event.clipboardData || window.clipboardData).items
      if (pasteItems && pasteItems.length) {
        // 获取剪切板中最新的对象
        let imgObj = pasteItems[0].getAsFile()
        this.pasteImgObj =
            imgObj !== null
                ? new File(
                [imgObj],
                `metesShare_${new Date().valueOf()}.${
                    imgObj.name.split('.')[1]
                }`,
                {
                  type: imgObj.type,
                }
                )
                : null
      } else {
        this.$message.error('当前浏览器不支持')
        return false
      }
      if (!this.pasteImgObj) {
        this.$message.error('粘贴内容非图片')
        return false
      }
      this.pasteImg.name = this.pasteImgObj.name
      // 此时file就是剪切板中的图片对象
      // 如果需要预览，可以执行下面代码
      let reader = new FileReader()
      let _this = this
      reader.onload = function (event) {
        _this.pasteImg.src = event.target.result
      }
      reader.readAsDataURL(this.pasteImgObj)
    },


    /**
     * 添加文件的回调函数
     * @param {object} file 文件信息
     */
    async handleFileAdded(file) {
      if (file.status !== 'ready') return
      this.options.target = this.uploadData.inlet
      this.options.headers.Authorization = 'Basic ' + this.uploadData.inletToken
      this.dropBoxShow = false
      this.panelShow = true
      this.collapse = false
      this.fileKey = FileCrypto.generateKey()

      file.statusStr = '文件加密完成'
      await FileCrypto.encryptFile(file, this.fileKey).then(() => {
      })
    },

    /**
     * 文件上传成功 回调函数
     * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
     * @param {object} file 当前成功的 Uploader.File 对象本身
     * @param {string} response 服务端响应内容，永远都是字符串
     */
    handleFileSuccess(res, file) {

      let pinParams = {
        cid: res.Hash,
        fileName: res.Name,
        fileSize: res.Size,
        fileKey: '',
      }
      pinParams.fileKey = Crypto.encryptAes(
          localStorage.getItem('mk'),
          this.fileKey
      )
      console.log(pinParams)
      pinByHash(pinParams)
          .then((res) => {
            if (res.code == 200) {
              this.$message.success('文件上传成功')
              this.$emit('closeUploadDialog')
              //fileList
              this.$EventBus.$emit('refreshList', '')
            }
          })
          .catch((err) => {
            this.$message.error(err)
          })
    },
    /**
     * 文件上传失败 回调函数
     * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
     * @param {object} file 当前成功的 Uploader.File 对象本身
     * @param {string} response 服务端响应内容，永远都是字符串
     */
    handleFileError() {
      this.$message({
        message: '上传出错了',
        type: 'error',
      })
    },

  },
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
@import '~@/assets/styles/mixins.styl'
#global-uploader
  position: fixed
  z-index: 20
  right: 15px
  bottom: 15px

  .drop-box
    position: fixed
    z-index: 19
    top: 0
    left: 0
    border: 5px dashed #8091a5 !important
    background: #ffffffd9
    color: #8091a5 !important
    text-align: center
    box-sizing: border-box
    height: 100%
    line-height: 100%
    width: 100%

    .text
      position: absolute
      top: 50%
      left: 50%
      width: 100%
      transform: translate(-50%, -50%)
      font-size: 30px

    .upload-icon
      position: absolute
      right: 176px
      top: 16px
      cursor: pointer

      &:hover
        color: $Primary

    .delete-icon
      position: absolute
      right: 80px
      top: 16px
      cursor: pointer

      &:hover
        color: $Danger

    .close-icon
      position: absolute
      right: 16px
      top: 16px
      cursor: pointer

      &:hover
        color: $Success

    .paste-img-wrapper
      width: 100%
      height: 100%

    .paste-img
      margin-top: 16px
      max-width: 90%
      max-height: 80%

    .paste-name
      height: 24px
      line-height: 24px
      font-size: 18px
      color: $PrimaryText

  .uploader-app
    width: 560px

  .file-panel
    background-color: #fff
    border: 1px solid #e2e2e2
    border-radius: 7px 7px 0 0
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2)

    .file-title
      display: flex
      height: 40px
      line-height: 40px
      padding: 0 15px
      border-bottom: 1px solid #ddd

      .title-span
        padding-left: 0
        margin-bottom: 0
        font-size: 16px

        .count
          color: $SecondaryText

      .operate
        flex: 1
        text-align: right

        >>> .el-button--text
          color: $PrimaryText

          i[class^=el-icon-]
            font-weight: 600

          &:hover
            .el-icon-full-screen, .el-icon-minus
              color: $Success

            .el-icon-close
              color: $Danger

    .file-list
      position: relative
      height: 240px
      overflow-x: hidden
      overflow-y: auto
      background-color: #fff
      font-size: 12px
      setScrollbar(8px, #EBEEF5, #C0C4CC)

      .file-item
        position: relative
        background-color: #fff

        >>> .uploader-file
          height: 40px
          line-height: 40px

          .uploader-file-progress
            border: 1px solid $Success
            border-right: none
            border-left: none
            background: #e1f3d8

          .uploader-file-name
            width: 44%

          .uploader-file-size
            width: 16%

          .uploader-file-meta
            display: none

          .uploader-file-status
            width: 30%
            text-indent: 0

          .uploader-file-actions > span
            margin-top: 12px

        >>> .uploader-file[status='success']
          .uploader-file-progress
            border: none

      .file-item.custom-status-item
        >>> .uploader-file-status
          visibility: hidden

        .custom-status
          position: absolute
          top: 0
          right: 10%
          width: 24%
          height: 40px
          line-height: 40px

    &.collapse
      .file-title
        background-color: #E7ECF2

  .no-file
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    font-size: 16px

  /deep/ .uploader-file-icon
    display: none

  /deep/ .uploader-file-actions > span
    margin-right: 6px

/* 隐藏上传按钮 */
.select-file-btn
  display: none
</style>
