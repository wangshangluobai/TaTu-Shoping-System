import Vue from 'vue'
import App from './App.vue'

// 三级联动组件  全局组件
import TypeNav from '@/components/TypeNav'
// Carousel Component
import Carousel from '@/components/Carousel'
// 分页器
import Pagination from '@/components/Pagination'
// Element-UI
import { Button, MessageBox } from 'element-ui';
// 第一个参数 全局组件的名字 第二个参数 哪一个组件
Vue.component(TypeNav.name,TypeNav)
// same to prev
Vue.component(Carousel.name,Carousel)
// same to prve
Vue.component(Pagination.name,Pagination)
// 
Vue.component(Button.name,Button)
// 注册使用 挂载到Vue的原型上 每一个组件都能访问到
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// 引入MockServer.js
import '@/mock/mockServe';
// 引入swiper样式
import 'swiper/css/swiper.css';
// 引入表单验证插件
import '@/plugins/validate'
// 引入lazyload
import Vuelazyload from 'vue-lazyload'
// 引入图片
import dram from '@/assets/dram.gif'
// 注册插件
Vue.use(Vuelazyload,{
  // 懒加载默认图片
  loading:dram
})

// 引入路由
import router from '@/router';
// 引入仓库vuex
import store from '@/store';
Vue.config.productionTip = false

import * as API from '@/api';

new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$API = API;
    Vue.prototype.$bus = this;
  },
  // 注册路由 组件身上会拥有$route,$router属性
  router,
  // 注册vuex 组件身上会拥有一个$store属性
  store,
}).$mount('#app')
