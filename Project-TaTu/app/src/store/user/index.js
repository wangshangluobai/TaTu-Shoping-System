// 登录与注册模块
import {reqInspectCode,reqRegister,reqLogin,reqUserInfo,reqUserLogout} from '@/api'
import {setToken,getToken,removeToken} from '@/utils/token'

const state = {
  inspectcode:'',
  token:getToken(),
  userInfo:{},
};
const mutations = {
  GETRESPECTCODE(state,data){
    state.inspectcode = data
  },
  USERLOGIN(state,token){
    state.token = token
  },
  GETUSERINFO(state,userInfo){
    state.userInfo = userInfo
  },
  GETLOGOUT(state){
    state.inspectcode = '',
    state.token = '',
    state.userInfo = {},
    removeToken()
  }
};
const actions = {
  // 获取验证码
  async getInspectCode({commit},phone){
    let result = await reqInspectCode(phone);
    if(result.code == 200){
      commit('GETRESPECTCODE',result.data)
      return 'ok'
    }else{
      return Promise.reject(new Error('获取验证码失败'))
    }
  },
  // 用户注册
  async userRegister({commit},data){
    let result = await reqRegister(data)
    if(result.code == 200){
      return 'ok';
    }else{
      return Promise.reject(new Error('用户注册失败'))
    }
  },
  // 用户登录
  async userLogin({commit},data){
    let result = await reqLogin(data)
    if(result.code == 200){
      commit('USERLOGIN',result.data.token)
      // 持久化储存token
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('用户登录失败'))
    }
  },
  // 获取用户信息
  async getUserInfo({commit}){
    let result = await reqUserInfo()
    if(result.code == 200){
      commit('GETUSERINFO',result.data);
      return 'ok'
    }else{
      return Promise.reject(new Error('请求用户信息失败'))
    }
  },
  // 用户退出登录
  async getLogout({commit}){
    let result = await reqUserLogout()
    if(result.code == 200){
      commit('GETLOGOUT')
      return 'ok'
    }else{
      return Promise.reject(new Error('用户退出失败'))
    }
  }
};
const getters = {
  // token:state => state.userInfo.name //state.userInfo
};

export default {
  state,mutations,actions,getters,
}