
import {v4 as uuidv4} from 'uuid';
// 生成一个随机字符串 且每次执行不能发生变化 游客身份本地存储
export const getUUID =()=>{
  // 在生成之前检查本地是否存在uuid
  let uuid_token = localStorage.getItem('UUIDTOKEN');
  // 不存在则创建
  if(!uuid_token){
    // 生成
    uuid_token = uuidv4();
    // 本地存储
    localStorage.setItem('UUIDTOKEN',uuid_token)
  }
  return uuid_token
}