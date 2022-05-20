import { reqGoodsInfo } from "@/api";
import {reqUpdateShopCart} from '@/api'
import {getUUID} from '@/utils/uuid_token'

const state = {
   goodsInfo : {},
   // 游客临时身份
   uuid_token:getUUID(),
};
const mutations = {
  GETGOODINFO(state,goodsInfo){
    state.goodsInfo = goodsInfo
  },
};
const actions = {
  // 获取商品信息
  async getGoodInfo({commit},skuId){
    
    let result = await reqGoodsInfo(skuId)
    if(result.code == 200){
      commit('GETGOODINFO',result.data)
    }
  },
  // 发送商品信息至服务器
  async sendUpdateShopCart({commit},{skuId,skuNum}){// {commit},
    // 将加入购物车的商品数据交给服务器  只写入数据 不接收无需储存 只需看code码状态  
    let result = await reqUpdateShopCart(skuId,skuNum);
    if(result.code == 200){
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
  }
};
const getters = {
  categoryView(){return state.goodsInfo.categoryView || {}},
  skuInfo(){return state.goodsInfo.skuInfo || {}},
  spuSaleAttrList(){return state.goodsInfo.spuSaleAttrList || []},
};
export default {
  state,mutations,actions,getters
}