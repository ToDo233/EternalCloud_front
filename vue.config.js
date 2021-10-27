const productConfig = require('./public/config.json')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
    // 选项...
    publicPath: '/',

    //是否开启eslint校验
    lintOnSave: false,

    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        proxy: { //配置代理，解决跨域请求后台数据的问题
            '/api': {
                // 43.129.187.26
                target: productConfig.baseUrl, //后台接口，连接本地服务
                ws: true, //是否跨域
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },

    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, './fetch/*'),
                    to: path.resolve(__dirname, './dist'),
                    ignore: ['.*']
                }
            ])
        ]
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'stylus',
            patterns: []
        }
    }
}
