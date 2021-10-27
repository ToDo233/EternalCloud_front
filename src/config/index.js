/**
 * 存放项目配置
 */
const config = {

    domain: process.env.NODE_ENV === 'production' ? location.host.indexOf('.metes.me') !== -1 ? '.metes.me' : '' : location.hostname,
    /**
     * @description 文件展示模式选择列表时，所有可供选择的表格列名
     */
    allColumnList: ['extendName', 'fileSize', 'uploadTime', 'deleteTime']
}

export default config
