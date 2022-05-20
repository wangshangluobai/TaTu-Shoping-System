// 路由配置项
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'
import user from '@/store/user'
// 使用插件
Vue.use(VueRouter)


// 重写push|replace
// 先把VueRouter原型对象的push 保存
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
// 第一个参数：告诉push方法 往哪里跳转(传递那些参数)
VueRouter.prototype.push = function (location,resolve,reject){
  if(resolve && reject){
    originPush.call(this,location,resolve,reject)
  }else{
    originPush.call(this,location,()=>{},()=>{})
  }
}
VueRouter.prototype.replace = function (location,resolve,reject){
  if(resolve && reject){
    originReplace.call(this,location,resolve,reject)
  }else{
    originReplace.call(this,location,()=>{},()=>{})
  }
}
// 配置路由
let router =  new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    // console.log(to,from,savedPosition)
    if(to.path != from.path){
      return {
        /* top不起作用 怪 */
        y: 0
      }
    }
  },
})
// 全局守卫 前置守卫 在路由跳转之前进行判断  参数为箭头函数
router.beforeEach(async (to,from,next)=>{
  // to 可以获取到目标路由信息
  // form 可以获取到跳转前路由信息
  // next 放行函数 参数为路由地址
  // next()
  // console.log(to.path == '/login')
  let token = store.state.user.token;
  let name = store.state.user.userInfo.name

  // 判断用户是否获取token成功
  if(token&&token != 'undefined'){
    // console.log(1)
    // 用户拥有token 无需再次登录|注册
    if(to.path == '/login'||to.path == '/register'){
      // console.log(2)
      // 会直接跳转至home
      next('/home')
      // console.log(3)
    }else{
      // console.log(4)
      // 判断用户处于登录状态 访问！登录|注册页面  判断其用户信息状态
      if(name&&name != 'undefined'){
        // console.log(5)
        // 用户信息完整 则放行
        next()
        // console.log(6)
      }else{
        try {
          // console.log(7)
          // 缺少用户信息  再次获取用户信息
          await store.dispatch('getUserInfo')
          // console.log(8)
          next();
          // console.log(9)
        } catch (error) {
          // token失效 获取不到用户信息 需要重新获取token
          // 清除失效token
          await store.dispatch('getLogout')
          // 跳转至登录页面
          next('/login')
        }
      }
    }
  }else{
    // 未登录
    // next()||'/paysuccess'||'/center'
    // 未登录状态下不能去pay|paysuccess|center|trade
    let toPath = to.path
    if(toPath.indexOf('/pay')!=-1||toPath.indexOf('/center')!=-1||toPath.indexOf('/trade')!=-1){
      next('/login/?redirect='+toPath)
    }else{
      next()
    }
  }
})

export default router