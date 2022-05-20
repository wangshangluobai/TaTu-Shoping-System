// 支付相关数据仓库
import {reqAddressInfo,reqOrderInfo} from '@/api'


const state = {
  address:[],
  orders:{},
};
const mutations = {
  GETADDRESS(state,data){
    state.address = data
  },
  GETORDER(state,data){
    state.orders = data
  },
};
const actions = {
  async getAddress({commit}){
    let result = await reqAddressInfo()
    if(result.code == 200){
      commit('GETADDRESS',result.data)
      return 'ok'
    }else{
      return Promise.reject(new Error('地址获取失败'))
    }
  },
  async getOrder({commit}){
    let result = await reqOrderInfo()
    if(result.code == 200){
      commit('GETORDER',result.data)
      return 'ok'
    }else{
      return Promise.reject(new Error('获取商品信息失败'))
    }
  },
};
const getters = {};

export default {
  state,mutations,actions,getters,
}