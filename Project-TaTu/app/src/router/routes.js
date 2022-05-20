// 引入路由组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
// 二级路由组件
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

export default [
  /* 重定向，在项目跑起来的时候，访问/，立马让他定向到首页 */
  {
    path:'*',
    redirect:'/home',
    meta:{footerShow:true}
  },
  {
    name:'home',
    path:'/home',
    component:()=>import('@/pages/Home'),
    meta:{footerShow:true}
  },
  {
    name:'search',
    path:'/search/:keyword?',
    component:()=>import('@/pages/Search'),
    meta:{footerShow:true}
  },
  {
    name:'login',
    path:'/login',
    component:()=>import('@/pages/Login'),
    meta:{footerShow:false}
  },
  {
    name:'register',
    path:'/register',
    component:()=>import('@/pages/Register'),
    meta:{footerShow:false}
  },
  {
    name:'detail',
    path:'/detail/:skuid',
    component:()=>import('@/pages/Detail'),
    meta:{footerShow:true}
  },
  {
    name:'addcartsuccess',
    path:'/addcartsuccess',
    component:AddCartSuccess,
    meta:{footerShow:true}
  },
  {
    name:'shopcart',
    path:'/shopcart',
    component:ShopCart,
    meta:{footerShow:true}
  },
  {
    name:'trade',
    path:'/trade',
    component:Trade,
    meta:{footerShow:true},
    beforeEnter: (to, from,next) => {
      if(from.path == '/shopcart'){
        next()
      }else{
        next(false)
      }
    },
  },
  {
    name:'pay',
    path:'/pay',
    component:()=>import('@/pages/Pay'),
    meta:{footerShow:true},
    beforeEnter:(to, from,next)=>{
      if(from.path == '/trade'){
        next()
      }else{
        next(false)
      }
    }
  },
  {
    name:'paysuccess',
    path:'/paysuccess',
    component:PaySuccess,
    meta:{footerShow:true},
    /* beforeEnter:(to,from,next)=>{
      if(from.path == '/pay'){
        next()
      }else{
        next(false)
      }
    } */
  },
  {
    name:'center',
    path:'/center',
    component:Center,
    meta:{footerShow:true},
    children:[
      {
        name:'MyOrder',
        path:'myorder',
        component:MyOrder,
      },
      {
        name:'grouporder',
        path:'grouporder',
        component:GroupOrder,
      },
      {
        path:'/center',
        redirect:'/center/myorder',
      }
    ]
  }
  
]