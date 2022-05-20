// 引入api接口
import { reqShopCart,reqDeleteCartById,reqChangeGoodsCheck } from "@/api";

const state={
  shopCartList:[],
};
const mutations={
  GETSHOPCART(state,data){
    state.shopCartList = data
  }
};
const actions={
  // 获取购物车商品信息
  async getShopCart({commit}){
    let result = await reqShopCart();
    if(result.code == 200){
      commit('GETSHOPCART',result.data)
    }
  },
  // 删除购物车某一项商品
  async deleteCartGoodsBySkuId({commit},skuId){
    let result = await reqDeleteCartById(skuId)
    if(result.code == 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  },
  // 更改购物车商品选中状态
  async changeGoodsCheck({commit},{skuId,isChecked}){
    let result = await reqChangeGoodsCheck(skuId,isChecked)
    if(result.code == 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  },
  // 删除购物车处于选中状态的商品
  deleteChecked({dispatch,getters}){
    // promise结果容器
    let promiseAll = [];
    // 从getters枚举isChecked属性 判断是否勾选 
    getters.cartList.cartInfoList.forEach(e => {
      // 删除选中状态的商品
      let promise = e.isChecked==1?dispatch('deleteCartGoodsBySkuId',e.skuId):'';
      // 将服务器返回删除结果信息收集
      promiseAll.push(promise)
    });
    // 判断是否产生错误
    return Promise.all(promiseAll);
  },
  checkAllGoods({dispatch,state},isChecked){
    // 存储每次请求返回的状态
    let promiseAll = [];
    // 遍历购物车商品
    state.shopCartList[0].cartInfoList.forEach((item)=>{
      // 优化请求次数  修改前后一致 便无需修改
      if(item.isChecked!=isChecked){
        // 调用函数 更改状态
        let promise = dispatch('changeGoodsCheck',{'skuId':item.skuId,isChecked})
        // 收集函数执行结果状态
        promiseAll.push(promise)
      }
    })
    // 返回状态至组件
    return Promise.all(promiseAll)
  }
};
const getters={
  cartList(state){
    return state.shopCartList[0]||{}//.shopCartList[0]//.cartInfoList
  }
};
export default {
  state,mutations,actions,getters,
}