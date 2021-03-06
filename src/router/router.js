import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home'),
      meta: {
        title: '永恒云盘',
        content: {
          description:
            '基于Spring Boot + Vue CLI@3 框架开发的Web文件系统，旨在为用户提供一个简单、方便的文件存储方案',
        },
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: { title: '登录 - 永恒云盘' },
    },
    {
      path: '/register',
      name: 'Register',
      component: () =>
        import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
      meta: { title: '注册 - 永恒云盘' },
    },
    {
      path: '/file',
      name: 'File',
      component: () =>
        import(/* webpackChunkName: "file" */ '@/views/file/File.vue'),
      meta: {
        requireAuth: true, //  当前路由是否需要登录才可进入
        title: '永恒云盘',
        content: {
          description:
            '基于Crust IPFS + Vue CLI@3 开发的Web云盘系统，旨在为用户提供一个简单、方便、安全的文件存储方案',
        },
        breadCrumbName: '全部文件',
      },
    },
    {
      path: '/onlyoffice',
      name: 'Onlyoffice',
      meta: {
        title: '在线编辑预览 - 永恒云盘',
        content: {
          description: '在线编辑预览',
        },
      },
      component: () => import('@/views/OnlyOffice/index.vue'),
    },
    {
      path: '/share/:shareBatchNum',
      name: 'Share',
      component: () =>
        import(/* webpackChunkName: "share" */ '@/views/Share/index.vue'),
      meta: {
        title: '分享 - 永恒云盘',
        breadCrumbName: '分享文件',
      },
      props: true,
    },
    {
      path: '/myshare',
      name: 'MyShare',
      component: () =>
        import(/* webpackChunkName: "my_share" */ '@/views/MyShare/index.vue'),
      meta: {
        requireAuth: true,
        title: '我的分享 - 永恒云盘',
        breadCrumbName: '我的分享',
      },
    },
    {
      path: '*',
      name: 'Error_404',
      component: () =>
        import(/* webpackChunkName: "error_404" */ '@/views/ErrorPage/404.vue'),
      meta: { title: '404 - 永恒云盘' },
    },
  ],
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
