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
        title: 'Metes',
        content: {
          description:''
            ,
        },
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: { title: '登录 - Metes' },
    },
    {
      path: '/register',
      name: 'Register',
      component: () =>
        import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
      meta: { title: '注册 - Metes' },
    },
    {
      path: '/file',
      name: 'File',
      component: () =>
        import(/* webpackChunkName: "file" */ '@/views/file/File.vue'),
      meta: {
        requireAuth: true, //  当前路由是否需要登录才可进入
        title: 'Metes',
        content: {
          description:
            '基于Crust IPFS + Vue CLI@3 开发的Web云盘系统，旨在为用户提供一个简单、方便、安全的文件存储方案',
        },
        breadCrumbName: 'All',
      },
    },

    {
      path: '*',
      name: 'Error_404',
      component: () =>
        import(/* webpackChunkName: "error_404" */ '@/views/ErrorPage/404.vue'),
      meta: { title: '404 - Metes' },
    },
  ],
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
