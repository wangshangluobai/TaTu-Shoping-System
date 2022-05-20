// 对外暴露一个函数

// 通过函数保存token至本地
export const setToken = (token)=>{
  localStorage.setItem('TOKEN',token)
};
// 通过函数获取本地存储token值
export const getToken = ()=>{
  return localStorage.getItem('TOKEN')
}
// 通过函数清除本地token值
export const removeToken = ()=>{
  localStorage.removeItem('TOKEN')
}