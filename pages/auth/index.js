import { request} from '../../request/index'
import {login} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime';


Page({
// 获取用户信息
 async handleGetUserInfo(e) {
    try {
      // 1. 获取用户信息
      const {encryptedData, rawData, iv, signature} = e.detail
      // 2. 获取小程序成功登陆后的code
      const {code} = await login()
      const loginParams = {encryptedData, rawData, iv, signature, code}
      // 3. 发送请求，获取token的值
      const {token} = await request({url: '/users/wxlogin', data: loginParams, method: 'POST'})
      // 4. 把token存储到缓存中同时跳转回上一个页面
      wx.wx.setStorageSync('token', token); 
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error)
    }
  }
})