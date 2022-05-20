// 此模块 API进行统一管理
import requests from "./request";
import mockRequests from './mockAjax';
// 三级联动接口
// /api/product/getCategoryList  get 无参数
// axios发送请求返回结果Promise对象
// 当前函数执行需要把服务器返回结果返回
export const reqCategoryList = ()=>requests({url:'/product/getBaseCategoryList',method:'get'});
//({url:'/product/getBaseCategoryList',method:'get'});
// 获取banner
export const reqGetBannerList = ()=>mockRequests.get('/banner');
// 获取floor 数据
export const reqFloorList = ()=>mockRequests.get('/floor');
// 获取搜索模块数据 地址 /api/list  请求方式 post  参数 需要带参数
// 获取搜索模块数据接口 给服务器传递一个默认参数 至少是一个空对象
export const reqGetSearchInfo = (params)=>requests({url:'/list',method:'post',data:params})
// 获取产品详情信息的接口 URL:/api/item/{skuId}  请求方式 get
export const reqGoodsInfo = (skuId)=>requests({url:`/item/${skuId}`,method:'get'})
// 更新购物车
export const reqUpdateShopCart = (skuId,skuNum)=>requests({url:`/cart/addToCart/${skuId}/${skuNum}`,method:'post'})
// 获取购物车信息
export const reqShopCart = ()=>requests({url:'/cart/cartList',method:'get'})
// 删除购物车商品
export const reqDeleteCartById = (skuId)=>requests({url:`/cart/deleteCart/${skuId}`,method:'delete'})
// 修改商品选中状态
export const reqChangeGoodsCheck = (skuId,isChecked)=>requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})
// 获取验证码
export const reqInspectCode = (phone)=>requests({url:`/user/passport/sendCode/${phone}`,method:'get'})
// 注册
export const reqRegister = (data)=>requests({url:`/user/passport/register`,data,method:'post'})
// 登录
export const reqLogin = (data)=>requests({url:`/user/passport/login`,data,method:'post'})
// 获取用户信息 携带令牌
export const reqUserInfo = ()=>requests({url:`/user/passport/auth/getUserInfo`,method:'get'})
// 退出登录
export const reqUserLogout = ()=>requests({url:'/user/passport/logout',method:'get'})
// 获取用户地址信息
export const reqAddressInfo = ()=>requests({url:'/user/userAddress/auth/findUserAddressList',method:'get'})
// 获取商品清单
export const reqOrderInfo =()=>requests({url:'/order/auth/trade',method:'get'})
// 提交订单
export const reqSubmitOrder =(tradeNo,data)=>requests({url:`order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})
// 获取支付信息
export const reqPayment = (orderId)=>requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'})
// 获取支付订单状态
export const reqPayStatus = (orderId)=>requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})
// 获取订单列表
export const reqMyOrderList = (page,limit)=>requests({url:`order/auth/${page}/${limit}`,method:'get'})